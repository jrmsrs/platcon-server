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
  @ApiProperty({ description: 'Member stage name' })
  @IsNotEmpty()
  @IsString()
  stage_name: string

  @ApiProperty({ description: 'Member description' })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiPropertyOptional({ description: 'Member avatar (Google Docs) URI' })
  @IsOptional()
  @IsString()
  @MinLength(33)
  @MaxLength(33)
  avatar_uri?: string

  @ApiPropertyOptional({ description: 'Member website URLs' })
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

  @ApiPropertyOptional({ description: 'Member user UUID' })
  @IsOptional()
  @IsUUID('4')
  user_id?: string
}
