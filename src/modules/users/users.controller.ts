import {
  BadRequestException,
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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { User } from '../../entities/user.entity'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

@ApiTags('users')
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

  @Patch('me/update')
  updateUser(@Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(body)
  }
}
