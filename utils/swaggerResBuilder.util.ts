import { HttpStatus, Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

class ErrorMessage {
  @ApiProperty({ description: 'Mensagem do Erro', type: String })
  message: string | string[]

  @ApiProperty({ description: 'Tipo do Erro' })
  error: string

  @ApiProperty({ description: 'Código (HTTP) do Erro' })
  statusCode: HttpStatus
}

class SuccessMessage {
  @ApiProperty({ description: 'Mensagem do Sucesso', type: String })
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
