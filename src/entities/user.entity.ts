import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Place } from './place.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  profile_image: string

  @Column()
  password: string

  @Column({default: null})
  email_token: string | null

  @Column({ default: false })
  confirmed: boolean

  @OneToMany(() => Place, (place) => place.place)
  places: Place[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
