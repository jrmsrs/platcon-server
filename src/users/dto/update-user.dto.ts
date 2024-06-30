import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateUserDto } from '#users/dto/create-user.dto'

export class UserId {
  @IsUUID('4')
  @ApiProperty({ description: 'UUID do Usuário' })
  id: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
