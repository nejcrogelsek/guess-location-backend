import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import {
  IAuthReturnData,
  IUserDataFromToken
} from '../../interfaces/auth.interface'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LocalAuthGuard } from './local-auth.guard'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags
} from '@nestjs/swagger'
import { User } from '../../entities/user.entity'
import { LoginUserDto } from './dto/login-user.dto'
import { GetRefreshTokenDto } from './dto/get-refresh-token.dto'
import { JwtAuthGuard } from './auth-jwt.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ description: 'API login user.' })
  @ApiBadRequestResponse()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() body: LoginUserDto): Promise<IAuthReturnData> {
    return this.authService.login(body)
  }

  @ApiCreatedResponse({ type: User, description: 'API register user.' })
  @ApiBadRequestResponse()
  @Post('register')
  register(@Body() body: CreateUserDto): Promise<IAuthReturnData> {
    return this.authService.register(body)
  }

  @ApiCreatedResponse({ description: 'API request refresh token.' })
  @ApiBadRequestResponse()
  @Post('refresh-token')
  refreshToken(
    @Body() body: GetRefreshTokenDto
  ): Promise<{ access_token: string }> {
    return this.authService.refreshToken(body)
  }

  @ApiCreatedResponse({ description: 'API verify email address.' })
  @ApiBadRequestResponse()
  @Get('/verify-email')
  verifyEmail(@Req() req, @Res() res) {
    return this.authService.verifyEmail(req, res)
  }

  @ApiCreatedResponse({
    description:
      'API for protected routes which return user data if user is authenticated.'
  })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  me(@Req() req): Promise<IUserDataFromToken> {
    return this.authService.me(req)
  }
}
