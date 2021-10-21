import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateGuessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  location_id: number

  @ApiProperty()
  @IsNotEmpty()
  lat: string

  @ApiProperty()
  @IsNotEmpty()
  lng: string

  @ApiProperty()
  @IsNotEmpty()
  address: string
}
