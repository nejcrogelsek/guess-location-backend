import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Guess } from './guess.entity'
import { User } from './user.entity'

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  lat: number

  @Column()
  long: number

  @Column()
  city: string

  @Column()
  user_id: number

  @ManyToOne(() => User, (user) => user.places, { onDelete: 'CASCADE' })
  place: Place

  @OneToMany(() => Guess, (guess) => guess.guess)
  guesses: Guess[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
