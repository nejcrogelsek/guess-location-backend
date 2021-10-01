import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  private logger = new Logger()
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find()
    } catch (err) {
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
      throw new BadRequestException(`Cannot delete a user with id: ${id}`)
    } finally {
      this.logger.log(`Deleting a user with id: ${id}`)
    }
  }
}
