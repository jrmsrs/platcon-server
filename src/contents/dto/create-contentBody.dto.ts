import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { ContentType } from '../entities/content-body.entity'

export class CreateContentBodyDto {
  @ApiProperty({ description: 'Tipo do Corpo' })
  @IsNotEmpty()
  @IsEnum(ContentType)
  @IsString()
  type: ContentType

  @ApiProperty({ description: 'Conteúdo do Corpo' })
  @IsNotEmpty()
  @IsString()
  value: string
}
