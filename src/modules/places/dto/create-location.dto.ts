import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @IsNotEmpty()
  lat: string

  @IsNotEmpty()
  long: string

  location_image: string

  @IsNotEmpty()
  address: string
}
