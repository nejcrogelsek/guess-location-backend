import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import { randomBytes } from 'crypto'

@Injectable()
export class UsersService {
  private logger = new Logger()
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
	private configService:ConfigService
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find()
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Error while searching for users.')
    } finally {
      this.logger.log('Searching for users.')
    }
  }

  async findById(id: number): Promise<User> {
    const found = this.usersRepository.findOne(id)

    if (!found) {
      throw new NotFoundException(`User with id: ${id} was not found.`)
    }

    return found
  }

  async findByEmail(email: string): Promise<User> {
    const found = await this.usersRepository.findOne({ email: email })

    if (!found) {
      throw new NotFoundException(`User with email: ${email} was not found.`)
    }

    return found
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user: User = await this.findById(id)
      return this.usersRepository.remove(user)
    } catch (err) {
      console.log(err)
      throw new BadRequestException(`Cannot delete a user with id: ${id}`)
    } finally {
      this.logger.log(`Deleting a user with id: ${id}`)
    }
  }

  async verifyEmail(reqUser: User) {
    try {
      const user: User = await this.findById(reqUser.id)
      user.confirmed = true
      await this.usersRepository.save(user)
    } catch (err) {
      console.log(err)
      throw new BadRequestException(
        `Cannot verify a user with id: ${reqUser.id}`
      )
    } finally {
      this.logger.log(`Verifying a user with id: ${reqUser.id}`)
    }
  }

  async generateUploadUrl(): Promise<string> {
    const bucketName = this.configService.get('AWS_STORAGE_BUCKET_NAME')
    const region = this.configService.get('AWS_BUCKET_REGION')
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY')

    const s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: 'v4'
    })

    const rawBytes = randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = {
      Bucket: bucketName,
      Key: imageName,
      Expires: 60
    }

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
  }
}
