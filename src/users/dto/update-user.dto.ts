import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { IsUUID } from 'class-validator'

export class FindOneParams {
  @IsUUID()
  @ApiProperty({ description: 'User UUID' })
  id: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
