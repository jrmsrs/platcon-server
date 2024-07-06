import { ApiProperty } from '@nestjs/swagger'

import { Channel } from '#app/channels/entities/channel.entity'

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Content } from './content.entity'

export enum ContentType {
  TEXT = 'text',
  VIDEO = 'video',
  AUDIO = 'audio',
}

@Entity('content_body')
export class ContentBody {
  @ApiProperty({ description: 'ContentBody UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'ContentBody type' })
  @Column({ type: 'enum', enum: ContentType, default: ContentType.TEXT })
  type: ContentType

  @ApiProperty({ description: 'ContentBody content' })
  @Column({ type: 'text' })
  value: string

  @ApiProperty({ description: 'ContentBody content', type: () => Channel })
  @ManyToOne(() => Content, (content) => content.body)
  @JoinColumn({ name: 'content_id' })
  content?: Channel
}
