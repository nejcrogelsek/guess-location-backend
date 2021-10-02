import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Place } from 'src/entities/place.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PlacesService {
  private logger = new Logger()
  constructor(
    @InjectRepository(Place) private placesRepository: Repository<Place>
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
      const location: Place = locations[Math.floor(Math.random() * locations.length)]
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
}
