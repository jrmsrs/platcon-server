import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { CreateChannelDto } from '#channels/dto/create-channel.dto'

export class FindOneParams {
  @IsUUID('4')
  @ApiProperty({ description: 'Channel UUID' })
  id: string
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
