import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common'
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
}
