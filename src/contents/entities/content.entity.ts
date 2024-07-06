import { ApiProperty } from '@nestjs/swagger'

import { Channel } from '#app/channels/entities/channel.entity'

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { ContentBody } from './content-body.entity'

@Entity('contents')
export class Content {
  @ApiProperty({ description: 'Content UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'Content title' })
  @Column({ type: 'text', unique: true })
  title: string

  @ApiProperty({ description: 'Content description' })
  @Column({ type: 'text' })
  description: string

  @ApiProperty({ description: 'Content thumb (Google Docs) URI' })
  @Column({ type: 'text' })
  thumb_uri?: string

  @ApiProperty({ description: 'Content channel', type: () => Channel })
  @ManyToOne(() => Channel, (channel) => channel.contents)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel

  @ApiProperty({ description: 'Content body', type: () => Channel })
  @OneToMany(() => ContentBody, (body) => body.content)
  @JoinColumn({ name: 'content_id' })
  body: ContentBody[]
}
