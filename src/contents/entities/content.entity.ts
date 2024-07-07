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
  @ApiProperty({ description: 'UUID do Conteúdo' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'Título do Conteúdo' })
  @Column({ type: 'text', unique: true })
  title: string

  @ApiProperty({ description: 'Descrição do Conteúdo' })
  @Column({ type: 'text' })
  description: string

  @ApiProperty({ description: 'URI (Google Docs) da thumb do Conteúdo' })
  @Column({ type: 'text' })
  thumb_uri?: string

  @ApiProperty({ description: 'Canal do Conteúdo', type: () => Channel })
  @ManyToOne(() => Channel, (channel) => channel.contents)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel

  @ApiProperty({ description: 'Corpo do Conteúdo', type: () => Channel })
  @OneToMany(() => ContentBody, (body) => body.content)
  @JoinColumn({ name: 'content_id' })
  body: ContentBody[]
}
