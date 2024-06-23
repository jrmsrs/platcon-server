import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator'

export class CreateMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  stage_name: string

  @ApiProperty()
  @IsNotEmpty()
  desc: string

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(33)
  @MaxLength(33)
  avatar_uri?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string
}
