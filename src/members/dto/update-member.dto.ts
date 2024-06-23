import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateMemberDto } from '#members/dto/create-member.dto'

export class FindOneParams {
  @IsUUID()
  @ApiProperty({ description: 'Member UUID' })
  id: string
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}