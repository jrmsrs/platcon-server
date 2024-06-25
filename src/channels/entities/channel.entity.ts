import { Member } from '#app/members/entities/member.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('channels')
export class Channel {
  @ApiProperty({ description: 'Channel UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToMany(() => Member, { cascade: ['insert', 'update'] })
  @JoinTable({
    synchronize: false,
    name: 'channel_members',
    joinColumn: { name: 'channel_id' },
    inverseJoinColumn: { name: 'member_id' },
  })
  @ApiPropertyOptional({ description: 'Channel members' })
  members?: Member[]

  @ApiProperty({ description: 'Channel name' })
  @Column({ type: 'text', unique: true })
  name: string

  @ApiProperty({ description: 'Channel description' })
  @Column({ type: 'text' })
  description: string

  @ApiProperty({ description: 'Channel tags' })
  @Column({ type: 'text', array: true })
  tags?: string[]

  @ApiProperty({ description: 'Channel logo (Google Docs) URI' })
  @Column({ name: 'logo_img_uri', type: 'text' })
  logo_uri?: string

  @ApiProperty({ description: 'Channel cover (Google Docs) URI' })
  @Column({ name: 'cover_img_uri', type: 'text' })
  cover_uri?: string
}
