import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateLocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @ApiProperty()
  @IsNotEmpty()
  lat: string

  @ApiProperty()
  @IsNotEmpty()
  long: string

  @ApiProperty()
  @IsNotEmpty()
  location_image: string

  @ApiProperty()
  @IsNotEmpty()
  address: string
}
