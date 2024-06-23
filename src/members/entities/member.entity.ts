import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('members')
export class Member {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  member_id?: string

  @ApiProperty()
  @Column({ type: 'text', unique: true })
  stage_name: string

  @ApiProperty()
  @Column({ type: 'text' })
  desc: string

  @ApiProperty()
  @Column({ type: 'text' })
  avatar_uri?: string

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  website?: string
}
