import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @IsNotEmpty()
  @IsNumber()
  lat: number

  @IsNotEmpty()
  @IsNumber()
  long: number

  location_image: string

  @IsNotEmpty()
  address: string
}
