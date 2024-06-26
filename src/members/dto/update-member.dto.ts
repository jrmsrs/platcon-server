import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateMemberDto } from '#members/dto'

export class MemberId {
  @IsUUID('4')
  @ApiProperty({ description: 'UUID do Membro' })
  id: string
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
