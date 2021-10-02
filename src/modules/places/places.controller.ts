import { Controller, Get } from '@nestjs/common'
import { Place } from 'src/entities/place.entity'
import { PlacesService } from './places.service'

@Controller('location')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get()
  getRecent():Promise<Place[]>{
	  return this.placesService.getRecent()
  }

  @Get('/best')
  getPersonalBest():Promise<Place[]>{
	  return this.placesService.getPersonalBest()
  }

  @Get('/random')
  getRandom():Promise<Place>{
	  return this.placesService.getRandom()
  }
}
