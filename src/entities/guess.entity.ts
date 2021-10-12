import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from './base'
import { Place } from './place.entity'

@Entity()
export class Guess extends BaseEntity {
  @ApiProperty()
  @Column()
  location_id: number

  @ApiProperty()
  @Column()
  user_id: number

  @ApiProperty()
  @Column()
  distance: number

  @ApiProperty()
  @Column()
  address: string

  @ManyToOne(() => Place, (place) => place.guesses, { onDelete: 'CASCADE' })
  guess: Place
}
