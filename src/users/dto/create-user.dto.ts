import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do Usuário' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: 'E-mail do Usuário' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Senha do Usuário' })
  @IsNotEmpty()
  password: string

  @ApiPropertyOptional({ description: 'URI (Google Docs) do avatar doUsuário' })
  @IsOptional()
  @IsString()
  @MinLength(33)
  @MaxLength(33)
  avatar_uri?: string
}
