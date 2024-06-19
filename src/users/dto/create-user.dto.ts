import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(33)
  @MaxLength(33)
  avatar_uri?: string
}
