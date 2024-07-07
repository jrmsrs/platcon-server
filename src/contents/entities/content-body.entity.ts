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
  @ApiProperty({ description: 'UUID do Corpo' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'Tipo do Corpo' })
  @Column({ type: 'enum', enum: ContentType, default: ContentType.TEXT })
  type: ContentType

  @ApiProperty({ description: 'Conteúdo do Corpo' })
  @Column({ type: 'text' })
  value: string

  @ManyToOne(() => Content, (content) => content.body)
  @JoinColumn({ name: 'content_id' })
  content?: Channel
}
