import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator'

export class GetRefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sub: number
}