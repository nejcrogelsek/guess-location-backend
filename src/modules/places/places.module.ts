import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Place } from '../../entities/place.entity'
import { PlacesController } from './places.controller'
import { PlacesService } from './places.service'

@Module({
  imports: [TypeOrmModule.forFeature([Place,User])],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService]
})
export class PlacesModule {}
