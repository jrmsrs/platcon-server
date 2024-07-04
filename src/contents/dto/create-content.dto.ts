import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

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
}
