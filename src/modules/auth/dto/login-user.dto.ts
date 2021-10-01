import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  username: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string
}
