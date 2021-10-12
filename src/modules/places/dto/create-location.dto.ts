import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateLocationDto {
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
