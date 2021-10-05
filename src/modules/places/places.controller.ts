import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Guess } from 'src/entities/guess.entity'
import { Place } from 'src/entities/place.entity'
import { CreateGuessDto } from './dto/create-guess.dto'
import { CreateLocationDto } from './dto/create-location.dto'
import { PlacesService } from './places.service'

@ApiTags('places')
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

  @Delete('/:id')
  deleteLocation(@Param('id', ParseIntPipe) id: number): Promise<Place> {
    return this.placesService.deleteLocation(id)
  }

  @Get('/guesses')
  getGuesses(): Promise<Guess[]> {
    return this.placesService.getGuesses()
  }

  @Get('/:id/user/:user_id')
  getUserGuess(@Param('id',ParseIntPipe) location_id:number,@Param('user_id',ParseIntPipe) user_id:number): Promise<Guess> {
    return this.placesService.getUserGuess({location_id,user_id})
  }

  @Delete('/guess/:id')
  deleteGuess(@Param('id',ParseIntPipe) id:number): Promise<Guess> {
    return this.placesService.deleteGuess(id)
  }

  @Post('/guess/:id')
  guessLocation(@Body() body: CreateGuessDto): Promise<Guess> {
    return this.placesService.guessLocation(body)
  }
}
