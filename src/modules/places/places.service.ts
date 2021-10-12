import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Place } from '../../entities/place.entity'
import { Repository } from 'typeorm'
import { CreateLocationDto } from './dto/create-location.dto'
import { User } from '../../entities/user.entity'
import { CreateGuessDto } from './dto/create-guess.dto'
import { Guess } from '../../entities/guess.entity'
import { IPersonalBest } from 'src/interfaces/place.interface'

@Injectable()
export class PlacesService {
  private logger = new Logger()
  constructor(
    @InjectRepository(Place) private placesRepository: Repository<Place>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Guess) private guessRepository: Repository<Guess>
  ) {}

  async getAll(): Promise<Place[]> {
    try {
      return this.placesRepository.find({
        order: { updated_at: 'DESC' },
        relations: ['guesses']
      })
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException('Error while searching for all locations.')
    } finally {
      this.logger.log('Searching for all locations.')
    }
  }

  async getRecent(id: number, user_id: number): Promise<Place[]> {
    try {
      if (id !== user_id) {
        throw Error
      }
      const result: Place[] = []
      const places: Place[] = await this.placesRepository.find({
        order: { updated_at: 'DESC' },
        relations: ['guesses']
      })
      places.forEach((p) => {
        if (p.user_id !== id) {
          result.push(p)
        }
      })
      return result
    } catch (err) {
      console.log(err.message)
      throw new BadRequestException(
        'Error while searching for most recent locations.'
      )
    } finally {
      this.logger.log('Searching for most recent locations.')
    }
  }

  async getPersonalBest(
    user_id: number,
    req: number
  ): Promise<IPersonalBest[]> {
    try {
      if (user_id !== req) {
        throw Error
      }
      const result: IPersonalBest[] = []
      const guesses = await this.guessRepository.find({ user_id: user_id })
      for (let i = 0; i < guesses.length; i++) {
        const l = await this.placesRepository.findOne({
          id: guesses[i].location_id
        })
        result.push({
          location: l,
          distance: guesses[i].distance
        })
      }
      result.sort(({ distance: a }, { distance: b }) => a - b)
      return result.slice(0, 3)
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
        relations: ['guesses']
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

  async createLocation(
    createLocationDto: CreateLocationDto,
    user_id: number
  ): Promise<Place> {
    try {
      const user = await this.usersRepository.findOne(user_id, {
        relations: ['places']
      })
      const newLocation = this.placesRepository.create({
        user_id: user_id,
        city: createLocationDto.address,
        lat: createLocationDto.lat,
        long: createLocationDto.long,
        location_image: createLocationDto.location_image
      })
      const savedLocation = await this.placesRepository.save(newLocation)
      user.places.push(savedLocation)
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

  async getUserGuess(data: {
    location_id: number
    user_id: number
  }): Promise<Guess> {
    try {
      return this.guessRepository.findOne({
        location_id: data.location_id,
        user_id: data.user_id
      })
    } catch (err) {
      console.log(err)
      throw new BadRequestException()
    } finally {
      this.logger.log('Searching for all guesses.')
    }
  }

  async guessLocation(
    createGuessDto: CreateGuessDto,
    user_id: number
  ): Promise<Guess> {
    try {
      const location = await this.placesRepository.findOne(
        createGuessDto.location_id,
        { relations: ['guesses'] }
      )
      const guesses = await this.guessRepository.find()
      for (let i = 0; i < guesses.length; i++) {
        if (
          user_id === guesses[i].user_id &&
          createGuessDto.location_id === guesses[i].location_id
        ) {
          await this.guessRepository.remove(guesses[i])
        }
      }
      const newGuess = this.guessRepository.create({
        location_id: createGuessDto.location_id,
        user_id: user_id,
        address: createGuessDto.address,
        distance: createGuessDto.distance
      })
      const savedGuess = await this.guessRepository.save(newGuess)
      location.guesses.push(savedGuess)
      await this.placesRepository.save(location)
      return savedGuess
    } catch (err) {
      console.log(err)
      throw new BadRequestException('Error guessing a location.')
    } finally {
      this.logger.log('Guessing location.')
    }
  }

  async deleteLocation(id_param: number, user_id: number): Promise<Place> {
    try {
      const l = await this.placesRepository.findOne(id_param)
      if (l.user_id !== user_id) {
        throw Error
      }
      const location: Place = await this.placesRepository.findOne(user_id)
      return this.placesRepository.remove(location)
    } catch (err) {
      console.log(err)
      throw new BadRequestException(
        `Cannot delete a location with id: ${id_param}`
      )
    } finally {
      this.logger.log(`Deleting a location with id: ${id_param}`)
    }
  }

  async deleteGuess(id: number, user_id: number): Promise<Guess> {
    try {
      const g = await this.guessRepository.findOne(id)
      if (g.user_id !== user_id) {
        throw Error
      }
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
