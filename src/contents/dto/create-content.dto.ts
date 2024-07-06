import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateContentBodyDto } from '.'

export class CreateContentDto {
  @ApiProperty({ description: 'Título do Conteúdo' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ description: 'Descrição do Conteúdo' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiPropertyOptional({
    description: 'URI (Google Docs) da thumb do Conteúdo',
  })
  @IsOptional()
  @IsString()
  @MinLength(33)
  @MaxLength(33)
  thumb_uri?: string

  @ApiPropertyOptional({ description: 'ID do Canal associado' })
  @IsNotEmpty()
  @IsUUID('4')
  channel_id: string

  @ApiProperty({
    description: 'Corpo do Conteúdo',
    type: () => CreateContentBodyDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateContentBodyDto)
  body?: CreateContentBodyDto[]
}
