import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  MinLength
} from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  first_name: string

  @IsOptional()
  last_name: string

  @IsOptional()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string
}
