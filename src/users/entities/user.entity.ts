import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { Role } from '#users/enums/role.enum'

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column({ type: 'text' })
  name: string

  @ApiProperty()
  @Column({ type: 'text', unique: true })
  email: string

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  password?: string

  @ApiProperty()
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  avatar_uri?: string
}
