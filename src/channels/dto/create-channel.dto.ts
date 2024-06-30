import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateChannelDto {
  @ApiProperty({ description: 'Nome do Canal' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: 'Descrição do Canal' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({ description: 'Tags do Canal' })
  @IsArray()
  @IsNotEmpty()
  tags: string[]

  @ApiPropertyOptional({ description: 'URI (Google Docs) da logo do Canal' })
  @IsOptional()
  @IsString()
  @MinLength(33)
  @MaxLength(33)
  logo_uri?: string

  @ApiPropertyOptional({ description: 'URI (Google Docs) da capa do Canal' })
  @IsOptional()
  @IsString()
  @MinLength(33)
  @MaxLength(33)
  cover_uri?: string

  @ApiPropertyOptional({ description: 'Membros do Canal' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  members?: string[]
}
