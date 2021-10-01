import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards
} from '@nestjs/common'
import { UsersService } from '../../modules/users/users.service'
import {
  IAuthReturnData,
  IUserDataFromToken
} from '../../interfaces/auth.interface'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtAuthGuard } from './auth-jwt.guard'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse
} from '@nestjs/swagger'
import { User } from '../../entities/user.entity'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<IAuthReturnData> {
    const { access_token } = await this.authService.login(req.user)
    const { id, email, first_name, last_name, profile_image } =
      await this.usersService.findByEmail(req.user.email)
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

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post('signup')
  async register(@Body() body: CreateUserDto): Promise<IAuthReturnData> {
    const data = await this.authService.register(body)
    return data
  }

  @Post('refresh-token')
  async refreshToken(@Body() body): Promise<{ access_token: string }> {
    try {
      const { access_token } = await this.authService.refreshToken(body)
      return {
        access_token
      }
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException()
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async me(@Request() req): Promise<IUserDataFromToken> {
    try {
      const user = await this.usersService.findById(req.user.id)
      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
      }
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException()
    }
  }
}
