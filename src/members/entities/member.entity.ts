import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Channel } from '#channels/entities/channel.entity'
import { User } from '#users/entities/user.entity'

@Entity('members')
export class Member {
  @ApiProperty({ description: 'Member UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'Member stage name' })
  @Column({ type: 'text', unique: true })
  stage_name: string

  @ApiProperty({ description: 'Member description' })
  @Column({ type: 'text' })
  description: string

  @ApiProperty({ description: 'Member avatar (Google Docs) URI' })
  @Column({ type: 'text' })
  avatar_uri?: string

  @ApiPropertyOptional({ description: 'Member website URLs' })
  @Column({ type: 'text', array: true, nullable: true })
  website?: string[]

  @ApiPropertyOptional({ description: 'Member user' })
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @ManyToMany(() => Channel)
  @JoinTable({
    synchronize: false,
    name: 'channel_members',
    joinColumn: { name: 'member_id' },
    inverseJoinColumn: { name: 'channel_id' },
  })
  channels?: Channel[]
}
