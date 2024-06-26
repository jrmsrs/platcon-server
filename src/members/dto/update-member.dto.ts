import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateMemberDto } from '#members/dto'

export class FindOneParams {
  @IsUUID('4')
  @ApiProperty({ description: 'Member UUID' })
  id: string
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
