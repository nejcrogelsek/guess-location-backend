import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Place } from '../../entities/place.entity'
import { Repository } from 'typeorm'
import { CreateLocationDto } from './dto/create-location.dto'
import { User } from 'src/entities/user.entity'

@Injectable()
export class PlacesService {
  private logger = new Logger()
  constructor(
    @InjectRepository(Place) private placesRepository: Repository<Place>,
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async getRecent(): Promise<Place[]> {
    try {
      return this.placesRepository.find({
        relations: ['user'],
        order: { updated_at: 'DESC' }
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
      return this.placesRepository.find({
        relations: ['user']
      })
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
      const newLocation = this.placesRepository.create(createLocationDto)
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
}
