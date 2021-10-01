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
  email: string

  @IsOptional()
  first_name: string

  @IsOptional()
  profile_image: string

  @IsOptional()
  last_name: string

  @IsOptional()
  password: string
}
