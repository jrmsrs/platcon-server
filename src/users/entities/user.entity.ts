import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { Role } from '#users/enums/role.enum'

@Entity('users')
export class User {
  @ApiProperty({ description: 'User UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'User name' })
  @Column({ type: 'text' })
  name: string

  @ApiProperty({ description: 'User email' })
  @Column({ type: 'text', unique: true })
  email: string

  @ApiPropertyOptional({ description: 'User hashed password' })
  @Column({ type: 'text', nullable: true })
  password?: string

  @ApiProperty({ description: 'User role', enum: Role })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @ApiPropertyOptional({ description: 'User avatar (Google Docs) URI' })
  @Column({ type: 'text', nullable: true })
  avatar_uri?: string
}
