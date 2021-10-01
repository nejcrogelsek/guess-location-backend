import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { IAuthReturnData } from '../../interfaces/auth.interface'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class AuthService {
  private logger = new Logger()
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.log('Validating a user...')
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }

    return null
  }
  async getAccessToken(user: User): Promise<{ access_token: string }> {
    const payload = { name: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
  async login(user: User): Promise<IAuthReturnData> {
    const { access_token } = await this.getAccessToken(user)
    const { id, email, first_name, last_name, profile_image, confirmed } =
      await this.usersService.findByEmail(user.email)
    // if (!user.confirmed) {
    //   throw new UnauthorizedException('Please confirm your email to login.')
    // }
    return {
      user: {
        id,
        email,
        first_name,
        last_name,
        profile_image
      },
      access_token
    }
  }
  async register(createUserDto: CreateUserDto): Promise<IAuthReturnData> {
    try {
      const user = await this.usersRepository.findOne({
        email: createUserDto.email
      })
      if (user && createUserDto.email === user.email) {
        throw new BadRequestException(
          `User with email: ${createUserDto.email} already exists.`
        )
      }
      const { confirm_password, password, ...rest } = createUserDto
      const salt = await bcrypt.genSalt(10)
      const hashedPassword: string = await bcrypt.hash(password, salt)

      const createdUser = this.usersRepository.create({
        ...rest,
        password: hashedPassword
      })
      const savedUser = await this.usersRepository.save(createdUser)

      const { access_token } = await this.getAccessToken(savedUser)

      const { id, email, first_name, last_name, profile_image } = savedUser

      // transporter
      //   const transporter = nodemailer.createTransport({
      //     service: 'gmail',
      //     host: 'smtp.gmail.com',
      //     port: 25,
      //     secure: true,
      //     auth: {
      //       user: email,
      //       pass: createUserDto.password
      //     },
      //     tls: {
      //       rejectUnauthorized: false
      //     }
      //   })
      //   await transporter.sendMail({
      //     to: email,
      //     subject: 'Confirm Email',
      //     html: 'Please click this link to confirm your email.'
      //   })

      //   this.jwtService.sign(
      //     {
      //       user: id
      //     },
      //     this.configService.get('JWT_SECRET'),
      //     {
      //       expiresIn: '1d'
      //     },
      //     (err, emailToken) => {
      //       const url = `http://localhost:3000/confirmation/${emailToken}`

      //       transporter.sendEmail({
      //         to: email,
      //         subject: 'Confirm Email',
      //         html: `Please click this link to confirm your email: <a href='${url}'>${url}</a>`
      //       })
      //     }
      //   )

      return {
        user: {
          id,
          email,
          first_name,
          last_name,
          profile_image
        },
        access_token
      }
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Please check your credentials.')
    } finally {
      this.logger.log('Creating a new user.')
    }
  }
  async refreshToken(payload: {
    name: string
    sub: number
  }): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
