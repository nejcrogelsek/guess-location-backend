import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}
