import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Place } from '../../entities/place.entity'
import { Repository } from 'typeorm'
import { CreateLocationDto } from './dto/create-location.dto'
import { User } from 'src/entities/user.entity'
import { CreateGuessDto } from './dto/create-guess.dto'
import { Guess } from 'src/entities/guess.entity'

@Injectable()
export class PlacesService {
  private logger = new Logger()
  constructor(
    @InjectRepository(Place) private placesRepository: Repository<Place>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Guess) private guessRepository: Repository<Guess>
  ) {}

  async getRecent(): Promise<Place[]> {
    try {
      return this.placesRepository.find({
        order: { updated_at: 'ASC' }
      })
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException(
        'Error while searching for most recent locations.'
      )
    } finally {
      this.logger.log('Searching for most recent locations.')
    }
  }

  async getPersonalBest(): Promise<Place[]> {
    try {
      return this.placesRepository.find()
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException(
        'Error while searching for personal best results.'
      )
    } finally {
      this.logger.log('Searching for personal best results.')
    }
  }

  async getRandom(): Promise<Place> {
    try {
      const locations = await this.placesRepository.find({
        relations: ['user']
      })
      const location: Place =
        locations[Math.floor(Math.random() * locations.length)]
      return location
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException(
        'Error while searching for random location.'
      )
    } finally {
      this.logger.log('Searching for random lcoation.')
    }
  }

  async createLocation(createLocationDto: CreateLocationDto): Promise<Place> {
    try {
      const user = await this.usersRepository.findOne(createLocationDto.user_id)
      const newLocation = this.placesRepository.create({
        user_id: createLocationDto.user_id,
        city: createLocationDto.address,
        lat: createLocationDto.lat,
        long: createLocationDto.long,
        location_image: createLocationDto.location_image
      })
      const savedLocation = await this.placesRepository.save(newLocation)
      //user.places.push(savedLocation)
      await this.usersRepository.save(user)
      return savedLocation
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Error creating a location.')
    } finally {
      this.logger.log('Creating a new location.')
    }
  }

  async getGuesses(): Promise<Guess[]> {
    try {
      return this.guessRepository.find()
    } catch (err) {
      console.log(err)
      throw new BadRequestException()
    } finally {
      this.logger.log('Searching for all guesses.')
    }
  }
  async getUserGuess(data: {location_id:number, user_id:number}): Promise<Guess> {
    try {
      return this.guessRepository.findOne({location_id: data.location_id,user_id:data.user_id})
    } catch (err) {
      console.log(err)
      throw new BadRequestException()
    } finally {
      this.logger.log('Searching for all guesses.')
    }
  }

  async guessLocation(createGuessDto: CreateGuessDto): Promise<Guess> {
    try {
      const guesses = await this.guessRepository.find()
      for (let i = 0; i < guesses.length; i++) {
        if (
          createGuessDto.user_id === guesses[i].user_id &&
          createGuessDto.location_id === guesses[i].location_id
        ) {
          await this.guessRepository.remove(guesses[i])
        }
      }
      const newGuess = this.guessRepository.create({
        location_id: createGuessDto.location_id,
        user_id: createGuessDto.user_id,
        address: createGuessDto.address,
        distance: createGuessDto.distance
      })
      return this.guessRepository.save(newGuess)
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Error guessing a location.')
    } finally {
      this.logger.log('Guessing location.')
    }
  }

  async deleteLocation(id: number): Promise<Place> {
    try {
      const location: Place = await this.placesRepository.findOne(id)
      return this.placesRepository.remove(location)
    } catch (err) {
      console.log(err)
      throw new BadRequestException(`Cannot delete a location with id: ${id}`)
    } finally {
      this.logger.log(`Deleting a location with id: ${id}`)
    }
  }
  async deleteGuess(id: number): Promise<Guess> {
    try {
      const guess: Guess = await this.guessRepository.findOne(id)
      return this.guessRepository.remove(guess)
    } catch (err) {
      console.log(err)
      throw new BadRequestException(`Cannot delete a guess with id: ${id}`)
    } finally {
      this.logger.log(`Deleting a guess with id: ${id}`)
    }
  }
}
