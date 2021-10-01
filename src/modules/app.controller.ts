import { Controller, Get, InternalServerErrorException } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    try {
      return 'This is NestJS API for project Geotagger.'
    } catch (err) {
      console.log(err.message)
      throw new InternalServerErrorException()
    }
  }
}
