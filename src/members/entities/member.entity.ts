import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('members')
export class Member {
  @ApiProperty({ description: 'Member UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiPropertyOptional({ description: 'Member user UUID' })
  @Column({ type: 'text', nullable: true })
  user_id?: string

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
}
