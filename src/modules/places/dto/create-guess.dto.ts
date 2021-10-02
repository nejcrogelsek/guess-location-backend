import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateGuessDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @IsNotEmpty()
  @IsNumber()
  location_id: number

  @IsNotEmpty()
  @IsNumber()
  lat: number

  @IsNotEmpty()
  @IsNumber()
  long: number

  @IsOptional()
  city: string
}
