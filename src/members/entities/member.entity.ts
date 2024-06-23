import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('members')
export class Member {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  user_id?: string

  @ApiProperty()
  @Column({ type: 'text', unique: true })
  stage_name: string

  @ApiProperty()
  @Column({ type: 'text' })
  description: string

  @ApiProperty()
  @Column({ type: 'text' })
  avatar_uri?: string

  @ApiPropertyOptional()
  @Column({ type: 'text', array: true, nullable: true })
  website?: string[]
}
