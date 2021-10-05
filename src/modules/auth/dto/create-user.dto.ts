import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'
import { Match } from './match-decorator'

export class CreateUserDto {
  @ApiProperty({required: false})
  profile_image: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  first_name: string

  @ApiProperty()
  @IsNotEmpty()
  last_name: string

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @Match(CreateUserDto, (s) => s.password)
  confirm_password: string
}
