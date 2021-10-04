import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateGuessDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @IsNotEmpty()
  @IsNumber()
  location_id: number

  @IsNotEmpty()
  distance: number

  @IsNotEmpty()
  address: string
}
