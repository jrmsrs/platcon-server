import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum UserRole {
  PRODUCER = 'producer',
  USER = 'user',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'UUID do Usuário' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'Nome do Usuário' })
  @Column({ type: 'text' })
  name: string

  @ApiProperty({ description: 'E-mail do Usuário' })
  @Column({ type: 'text', unique: true })
  email: string

  @ApiPropertyOptional({ description: 'Senha encriptada do Usuário' })
  @Column({ type: 'text', nullable: true })
  password?: string

  @ApiProperty({ description: 'Cargo do Usuário', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @ApiPropertyOptional({ description: 'URI (Google Docs) do avatar doUsuário' })
  @Column({ type: 'text', nullable: true })
  avatar_uri?: string
}
