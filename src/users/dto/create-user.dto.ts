import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  password: string

  @ApiPropertyOptional({ description: 'User avatar (Google Docs) URI' })
  @IsOptional()
  @MinLength(33)
  @MaxLength(33)
  avatar_uri?: string
}
