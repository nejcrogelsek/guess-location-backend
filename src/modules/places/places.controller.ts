import { Body, Controller, Get, Post } from '@nestjs/common'
import { Guess } from 'src/entities/guess.entity'
import { Place } from 'src/entities/place.entity'
import { CreateGuessDto } from './dto/create-guess.dto'
import { CreateLocationDto } from './dto/create-location.dto'
import { PlacesService } from './places.service'

@Controller('location')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get()
  getRecent(): Promise<Place[]> {
    return this.placesService.getRecent()
  }

  @Get('/best')
  getPersonalBest(): Promise<Place[]> {
    return this.placesService.getPersonalBest()
  }

  @Get('/random')
  getRandom(): Promise<Place> {
    return this.placesService.getRandom()
  }

  @Post()
  createLocation(@Body() body: CreateLocationDto): Promise<Place> {
    return this.placesService.createLocation(body)
  }

  @Post('location/guess/:id')
  guessLocation(@Body() body: CreateGuessDto):Promise<Guess>{
	  return this.placesService.guessLocation(body)
  }
}
