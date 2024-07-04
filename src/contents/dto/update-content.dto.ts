import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateContentDto } from '#contents/dto'

export class ContentId {
  @IsUUID('4')
  @ApiProperty({ description: 'UUID do Conteúdo' })
  id: string
}

export class UpdateContentDto extends PartialType(CreateContentDto) {}
