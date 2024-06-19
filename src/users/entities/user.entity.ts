import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from './role.enum'

export class User {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiPropertyOptional()
  password?: string

  @ApiProperty()
  role: Role

  @ApiPropertyOptional()
  avatar_uri?: string
}
