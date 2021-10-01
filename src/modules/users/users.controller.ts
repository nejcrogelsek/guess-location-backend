import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Res
} from '@nestjs/common'
import { Response } from 'express'
import { ApiOkResponse } from '@nestjs/swagger'
import { User } from '../../entities/user.entity'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deleteUser(id)
  }

  @Get('upload')
  async uploadFile(@Res() res: Response) {
    try {
      const url = await this.usersService.generateUploadUrl()
      res.send({ url })
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException()
    }
  }
}
