import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateMemberDto {
  @ApiProperty({ description: 'Nome artístico do Membro' })
  @IsNotEmpty()
  @IsString()
  stage_name: string

  @ApiProperty({ description: 'Descrição do Membro' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiPropertyOptional({ description: 'URI (Google Docs) do avatar do Membro' })
  @IsOptional()
  @IsString()
  @MinLength(33)
  @MaxLength(33)
  avatar_uri?: string

  @ApiPropertyOptional({ description: 'Redes sociais do Membro' })
  @IsOptional()
  @IsArray()
  @IsUrl(
    {
      require_protocol: true,
      require_host: true,
      require_tld: true,
    },
    { each: true }
  )
  website?: string[]

  @ApiPropertyOptional({ description: 'ID do Usuário associado' })
  @IsOptional()
  @IsUUID('4')
  user_id?: string
}
