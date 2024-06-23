import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsUUID, IsUrl, MaxLength, MinLength } from 'class-validator'

export class CreateMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  stage_name: string

  @ApiProperty()
  @IsNotEmpty()
  description: string

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(33)
  @MaxLength(33)
  avatar_uri?: string

  @ApiPropertyOptional()
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  user_id?: string
}
