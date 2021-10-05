import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Place } from './place.entity'

@Entity()
export class Guess {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

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

  @ApiProperty()
  @CreateDateColumn()
  created_at: string

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: string
}
