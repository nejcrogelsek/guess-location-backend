import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { Response } from 'express'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'
import { User } from '../../entities/user.entity'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/auth-jwt.guard'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: User, isArray: true })
  @ApiBadRequestResponse()
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteUser(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deleteUser(id, req.user.sub)
  }

  @UseGuards(JwtAuthGuard)
  @Get('upload')
  uploadFile(@Res() res: Response) {
    return this.usersService.uploadFile(res)
  }

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Patch('/me/update')
  updateUser(@Req() req, @Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(body, req.user.sub)
  }
}
