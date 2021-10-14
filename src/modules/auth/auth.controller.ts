import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { IAuthReturnData } from '../../interfaces/auth.interface'
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
import { Request, Response } from 'express'
import { IUserData } from '../../interfaces/user.interface'

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
  register(@Req() req,@Body() body: CreateUserDto): Promise<IAuthReturnData> {
    return this.authService.register(body,req)
  }

  @ApiCreatedResponse({ description: 'API verify email address.' })
  @ApiBadRequestResponse()
  @Get('/verify-email')
  verifyEmail(@Req() req: Request, @Res() res: Response) {
    return this.authService.verifyEmail(req, res)
  }

  @ApiCreatedResponse({ description: 'API request refresh token.' })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  refreshToken(
    @Req() req,
    @Body() body: GetRefreshTokenDto
  ): Promise<{ access_token: string }> {
    return this.authService.refreshToken(body, req.user.sub)
  }

  @ApiCreatedResponse({
    description:
      'API for protected routes which return user data if user is authenticated.'
  })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  me(@Req() req): Promise<IUserData> {
    return this.authService.me(req)
  }
}
