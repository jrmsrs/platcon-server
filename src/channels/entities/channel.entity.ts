import { Content } from '#app/contents/entities/content.entity'
import { Member } from '#app/members/entities/member.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('channels')
export class Channel {
  @ApiProperty({ description: 'UUID do Canal' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiPropertyOptional({ description: 'Membros do Canal' })
  @ManyToMany(() => Member)
  @JoinTable({
    synchronize: false,
    name: 'channel_members',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'member_id' },
  })
  members?: Member[]

  @ApiProperty({ description: 'Conteúdos do Canal', type: () => [Content] })
  @OneToMany(() => Content, (content) => content.channel)
  @JoinColumn({ name: 'channel_id' })
  contents: Content[]

  @ApiProperty({ description: 'Nome do Canal' })
  @Column({ type: 'text', unique: true })
  name: string

  @ApiProperty({ description: 'Descrição do Canal' })
  @Column({ type: 'text' })
  description: string

  @ApiProperty({ description: 'Tags do Canal' })
  @Column({ type: 'text', array: true })
  tags?: string[]

  @ApiProperty({ description: 'URI (Google Docs) da logo do Canal' })
  @Column({ name: 'logo_img_uri', type: 'text' })
  logo_uri?: string

  @ApiProperty({ description: 'URI (Google Docs) da capa do Canal' })
  @Column({ name: 'cover_img_uri', type: 'text' })
  cover_uri?: string
}
