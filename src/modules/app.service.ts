import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'

@Injectable()
export class AppService {
  private logger = new Logger()
  init(): string {
    try {
      return 'This is NestJS API for project Geotagger.'
    } catch (err) {
      console.log(err.message)
      throw new InternalServerErrorException()
    } finally {
      this.logger.log('GET default API result.')
    }
  }
}
