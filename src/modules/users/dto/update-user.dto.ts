import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty({ required: false })
  @IsOptional()
  first_name: string

  @ApiProperty({ required: false })
  @IsOptional()
  profile_image: string

  @ApiProperty({ required: false })
  @IsOptional()
  last_name: string

  @ApiProperty({ required: false })
  @IsOptional()
  password: string
}
