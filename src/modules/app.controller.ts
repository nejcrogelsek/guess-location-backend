import { Controller, Get } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags
} from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @ApiCreatedResponse({ description: 'API default.' })
  @ApiBadRequestResponse()
  @Get()
  init(): string {
    return this.appService.init()
  }
}
