import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column({ type: 'real' })
  lat: string

  @ApiProperty()
  @Column({ type: 'real' })
  long: string

  @ApiProperty()
  @Column()
  city: string

  @ApiProperty()
  @Column()
  location_image: string

  @ApiProperty()
  @Column()
  user_id: number

  @ManyToOne(() => User, (user) => user.places, { onDelete: 'CASCADE' })
  place: User

  @ApiProperty({ isArray: true })
  @OneToMany(() => Guess, (guess) => guess.guess)
  guesses: Guess[]

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date
}
