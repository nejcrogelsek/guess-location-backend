import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateGuessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  location_id: number

  @ApiProperty()
  @IsNotEmpty()
  distance: number

  @ApiProperty()
  @IsNotEmpty()
  address: string
}
