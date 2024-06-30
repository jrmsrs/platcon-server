import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateChannelDto } from '#channels/dto'

export class ChannelId {
  @IsUUID('4')
  @ApiProperty({ description: 'UUID do Canal' })
  id: string
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
