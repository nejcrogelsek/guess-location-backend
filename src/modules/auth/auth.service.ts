import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { IAuthReturnData } from '../../interfaces/auth.interface'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  private logger = new Logger()
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.log('Validating a user...')
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }

    return null
  }
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { name: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload)
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

      const { access_token } = await this.login(savedUser)

      const { id, email, first_name, last_name, profile_image } = savedUser

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
      throw err
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
