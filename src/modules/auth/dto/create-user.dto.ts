import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'
import { Match } from './match-decorator'

export class CreateUserDto {
  profile_image: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  first_name: string

  @IsNotEmpty()
  last_name: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  @Match(CreateUserDto, (s) => s.password)
  confirm_password: string
}
