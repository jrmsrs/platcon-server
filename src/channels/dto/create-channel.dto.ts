import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator'

export class CreateChannelDto {
  @ApiProperty({ description: 'Channel name' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Channel description' })
  @IsNotEmpty()
  description: string

  @ApiProperty({ description: 'Channel tags' })
  @IsArray()
  @IsNotEmpty()
  tags: string[]

  @ApiPropertyOptional({ description: 'Channel logo (Google Docs) URI' })
  @IsOptional()
  @MinLength(33)
  @MaxLength(33)
  logo_uri?: string

  @ApiPropertyOptional({ description: 'Channel cover (Google Docs) URI' })
  @IsOptional()
  @MinLength(33)
  @MaxLength(33)
  cover_uri?: string

  @ApiPropertyOptional({ description: 'Channel members' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  members?: string[]
}
