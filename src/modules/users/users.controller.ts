import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Res
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
  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deleteUser(id)
  }

  @Get('upload')
  uploadFile(@Res() res: Response) {
    return this.usersService.uploadFile(res)
  }

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Patch('/me/update')
  updateUser(@Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(body)
  }
}
