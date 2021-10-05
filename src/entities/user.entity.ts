import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column()
  email: string

  @ApiProperty()
  @Column()
  first_name: string

  @ApiProperty()
  @Column()
  last_name: string

  @ApiProperty()
  @Column()
  profile_image: string

  @ApiProperty()
  @Column()
  password: string

  @ApiProperty()
  @Column({ default: null })
  email_token: string | null
  
  @ApiProperty()
  @Column({ default: false })
  confirmed: boolean

  @ApiProperty({isArray: true})
  @OneToMany(() => Place, (place) => place.place)
  places: Place[]

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date
}
