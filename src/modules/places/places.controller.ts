import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'
import { Guess } from '../../entities/guess.entity'
import { Place } from '../../entities/place.entity'
import { IPersonalBest } from '../../interfaces/place.interface'
import { JwtAuthGuard } from '../auth/auth-jwt.guard'
import { CreateGuessDto } from './dto/create-guess.dto'
import { CreateLocationDto } from './dto/create-location.dto'
import { PlacesService } from './places.service'

@ApiTags('places')
@Controller('location')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @ApiOkResponse({ type: Place, isArray: true })
  @ApiBadRequestResponse()
  @Get('/all')
  getAll(): Promise<Place[]> {
    return this.placesService.getAll()
  }

  @ApiOkResponse({ type: Guess })
  @ApiBadRequestResponse()
  @Get('/guesses')
  getGuesses(): Promise<Guess[]> {
    return this.placesService.getGuesses()
  }

  @ApiOkResponse({ type: Place })
  @ApiBadRequestResponse()
  @Get('/random')
  getRandom(): Promise<Place> {
    return this.placesService.getRandom()
  }

  @ApiOkResponse({ type: Place, isArray: true })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getRecent(@Req() req,@Param('id', ParseIntPipe) id: number): Promise<Place[]> {
    return this.placesService.getRecent(id,req.user.sub)
  }

  @ApiOkResponse({ type: Place, isArray: true })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Get('/best/:id')
  getPersonalBest(
	  @Req() req,
    @Param('id', ParseIntPipe) id: number
  ): Promise<IPersonalBest[]> {
    return this.placesService.getPersonalBest(id,req.user.sub)
  }

  @ApiCreatedResponse({ type: Place })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Post()
  createLocation(@Req() req, @Body() body: CreateLocationDto): Promise<Place> {
    return this.placesService.createLocation(body, req.user.sub)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteLocation(
    @Req() req,
    @Param('id', ParseIntPipe) id_param: number
  ): Promise<Place> {
    return this.placesService.deleteLocation(id_param, req.user.sub)
  }

  @ApiOkResponse({ type: Guess })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Get('/:id/user/:user_id')
  getUserGuess(
    @Param('id', ParseIntPipe) location_id: number,
    @Param('user_id', ParseIntPipe) user_id: number
  ): Promise<Guess> {
    return this.placesService.getUserGuess({ location_id, user_id })
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/guess/:id')
  deleteGuess(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Guess> {
    return this.placesService.deleteGuess(id, req.user.sub)
  }

  @ApiCreatedResponse({ type: Guess })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Post('/guess/:id')
  guessLocation(@Req() req, @Body() body: CreateGuessDto): Promise<Guess> {
    return this.placesService.guessLocation(body, req.user.sub)
  }
}
