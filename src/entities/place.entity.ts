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
  lat: number

  @Column()
  long: number

  @Column()
  city: string

  @Column()
  user_id: number

  @ManyToOne(() => User, (user) => user.places, { onDelete: 'CASCADE' })
  place: Place

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
