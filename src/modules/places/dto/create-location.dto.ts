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

  @IsNotEmpty()
  city: string
}
