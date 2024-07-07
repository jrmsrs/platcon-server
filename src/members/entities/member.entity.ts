import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Channel } from '#channels/entities/channel.entity'
import { User } from '#users/entities/user.entity'

@Entity('members')
export class Member {
  @ApiProperty({ description: 'UUID do Membro' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'Nome artístico do Membro' })
  @Column({ type: 'text', unique: true })
  stage_name: string

  @ApiProperty({ description: 'Descrição do Membro' })
  @Column({ type: 'text' })
  description: string

  @ApiProperty({ description: 'URI (Google Docs) do avatar do Membro' })
  @Column({ type: 'text' })
  avatar_uri?: string

  @ApiPropertyOptional({ description: 'Redes sociais do Membro' })
  @Column({ type: 'text', array: true, nullable: true })
  website?: string[]

  @ApiPropertyOptional({ description: 'ID do Usuário associado' })
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @ManyToMany(() => Channel)
  @JoinTable({
    synchronize: false,
    name: 'channel_members',
    joinColumn: { name: 'member_id' },
    inverseJoinColumn: { name: 'channel_id' },
  })
  channels?: Channel[]
}
