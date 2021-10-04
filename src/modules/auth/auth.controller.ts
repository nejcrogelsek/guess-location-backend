import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req): Promise<IAuthReturnData> {
    return this.authService.login(req.user)
  }

  @Post('register')
  register(@Body() body: CreateUserDto): Promise<IAuthReturnData> {
    return this.authService.register(body)
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

  @Get('/confirmation/:token')
  async verifyEmail(@Req() req, @Res() res) {
    try {
      const {
        user: { id }
      } = this.jwtService.verify(
        req.params.token,
        this.configService.get('JWT_SECRET')
      )
      await this.usersService.verifyEmail(req.user)
    } catch (err) {
      console.log(err)
      throw new BadRequestException(
        'Error on: /confirmation/:token controller.'
      )
    }

    return res.redirect('http://localhost:3001/login')
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async me(@Req() req): Promise<IUserDataFromToken> {
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
