import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  lat: string

  @Column()
  long: string

  @Column()
  city: string

  @ManyToOne(() => User, (user) => user.places, { onDelete: 'CASCADE' })
  place: Place

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
