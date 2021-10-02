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
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  location_id: number

  @Column()
  user_id: number

  @Column()
  distance: number

  @Column()
  city: string

  @ManyToOne(() => Place, (place) => place.guesses, { onDelete: 'CASCADE' })
  guess: Place

  @CreateDateColumn()
  created_at: string

  @UpdateDateColumn()
  updated_at: string
}
