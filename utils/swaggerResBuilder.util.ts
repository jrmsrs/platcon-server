import { HttpStatus, Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

class ErrorMessage {
  @ApiProperty({ description: 'Error message', type: String })
  message: string | string[]

  @ApiProperty({ description: 'Error type' })
  error: string

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: HttpStatus
}

class SuccessMessage {
  @ApiProperty({ description: 'Success message', type: String })
  message: string
}

export const swaggerSuccessRes = (
  description: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: Type<unknown> | Function | [Function] | string = SuccessMessage
) => {
  return {
    description,
    type,
  }
}

export const swaggerErrorRes = (description: string) => {
  return {
    description,
    type: ErrorMessage,
  }
}
