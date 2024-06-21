import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateUserDto } from '#users/dto/create-user.dto'

export class FindOneParams {
  @IsUUID()
  @ApiProperty({ description: 'User UUID' })
  id: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
