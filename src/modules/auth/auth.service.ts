import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import {
  IAuthReturnData,
  IUserDataFromToken
} from '../../interfaces/auth.interface'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { ConfigService } from '@nestjs/config'
import * as sgMail from '@sendgrid/mail'
import { randomBytes } from 'crypto'
import { LoginUserDto } from './dto/login-user.dto'
import { GetRefreshTokenDto } from './dto/get-refresh-token.dto'
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
  private logger = new Logger()
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    sgMail.setApiKey(configService.get('SENDGRID_API_KEY'))
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ email })
      if (user && (await bcrypt.compare(password, user.password))) {
        return user
      }

      return null
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Error validation a user.')
    } finally {
      this.logger.log('Validating a user...')
    }
  }

  async getAccessToken(user: User): Promise<{ access_token: string }> {
    try {
      const payload = { name: user.email, sub: user.id }
      return {
        access_token: this.jwtService.sign(payload)
      }
    } catch (err) {
      console.log(err)
      throw new BadRequestException(
        'Error while getting the user access token.'
      )
    } finally {
      this.logger.log('Getting the user access token.')
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<IAuthReturnData> {
    try {
      const user = await this.usersRepository.findOne({
        email: loginUserDto.username
      })
      if (!user.confirmed) {
        throw new UnauthorizedException('Please confirm your email to login.')
      }
      const { access_token } = await this.getAccessToken(user)
      const { id, email, first_name, last_name, profile_image, confirmed } =
        user
      return {
        user: {
          id,
          email,
          first_name,
          last_name,
          profile_image,
          confirmed
        },
        access_token
      }
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Error while logging user.')
    } finally {
      this.logger.log('Logging user in application.')
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
      const { password, ...rest } = createUserDto
      const salt = await bcrypt.genSalt(10)
      const hashedPassword: string = await bcrypt.hash(password, salt)

      const createdUser = this.usersRepository.create({
        ...rest,
        email_token: randomBytes(64).toString('hex'),
        password: hashedPassword
      })

      const savedUser = await this.usersRepository.save(createdUser)

      const { access_token } = await this.getAccessToken(savedUser)

      const { id, email, first_name, last_name, profile_image, confirmed } =
        savedUser

      const msg = {
        from: {
			name: 'Geotagger',
			email: 'nejcrogelsek0@gmail.com'
		},
        to: createUserDto.email,
        subject: 'Geotagger - verify your email',
        text: `
			   Hello, thanks for registering on our site.
			   Please copy and paste the address below to verify your account.
			   http://localhost:3000/auth/verify-email?token=${createdUser.email_token}
			`,
        html: `
				<h1>Hello</h1>
				<p>Thanks for registering on our site.</p>
				<p>Please click on the link below to verify your account.</p>
				<a href='http://localhost:3000/auth/verify-email?token=${createdUser.email_token}'>Verify your account</a>
			`
      }
      await sgMail.send(msg)
      console.log(
        'Thanks for registering. Please check your email to verify your account.'
      )

      return {
        user: {
          id,
          email,
          first_name,
          last_name,
          profile_image,
          confirmed
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

  async verifyEmail(req: Request, res: Response) {
    try {
      const user = await this.usersRepository.findOne({
        email_token: req.query.token.toString()
      })
      if (!user) {
        throw new BadRequestException(
          'Token is invalid. Please contact us for assistance.'
        )
      }
      user.email_token = null
      user.confirmed = true
      await this.usersRepository.save(user)

	  // Redirect to frontend login page -- maybe setSuccess('Your email successfully validated. Now you can login.')
	  console.log('RESPONSE: ', req.get('host'))
	  res.redirect('http://localhost:3001/login?message="Your email successfully validated. Now you can login."')
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException(
        'Token is invalid. Please contact us for assistance.'
      )
    } finally {
      this.logger.log('Verifing email address')
    }
  }

  async refreshToken(
    payload: GetRefreshTokenDto
  ): Promise<{ access_token: string }> {
    try {
      const access_token = this.jwtService.sign(payload)
      return {
        access_token
      }
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException()
    } finally {
      this.logger.log('Request refresh token.')
    }
  }

  async me(req): Promise<IUserDataFromToken> {
    try {
      const user = await this.usersService.findById(req.user.id)
      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
        confirmed: user.confirmed
      }
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException()
    } finally {
      this.logger.log('Authenticated user requesting for data. function => me')
    }
  }
}
