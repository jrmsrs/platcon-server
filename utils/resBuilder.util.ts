import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class ErrorMessage {
  @ApiProperty({ description: 'Error message', type: String })
  message: string | string[]

  @ApiProperty({ description: 'Error type' })
  error: string

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: HttpStatus
}

export class SuccessMessage {
  @ApiProperty({ description: 'Success message', type: String })
  message: string
}

export class ResponseBuilder {
  constructor(public msg = '') {}
  // subjects
  user(id?: string) {
    this.msg += 'user'
    if (id) this.msg += ` id={${id}}`
    return this
  }
  member(id?: string) {
    this.msg += 'member'
    if (id) this.msg += ` id={${id}}`
    return this
  }

  pre(self: this) {
    this.msg = self.msg ? `${self.msg} ` : ''
  }

  // success
  updated(where?: any) {
    return { message: this.msg + ` updated successfully, where: ${JSON.stringify(where)}` }
  }
  deleted() {
    return { message: this.msg + ' deleted successfully' }
  }

  // errors
  each() {
    this.pre(this)
    this.msg += 'each value in'
    return this
  }
  notFound() {
    this.pre(this)
    this.msg += 'not found'
    return this
  }
  fkNotFound(ref: string, fk: string) {
    this.pre(this)
    this.msg += `${ref} with id={${fk}} does not exist`
    return this
  }
  mustBe(field: string, dataType: string) {
    this.pre(this)
    this.msg += `${field} must be ${dataType}`
    return this
  }
  conflict(uniqueField?: string) {
    if (uniqueField) {
      this.pre(this)
      this.msg += `with ${uniqueField} already exists`
    } else {
      this.msg = `request with ${this.msg} can't be completed due to a conflict with the current state of the resource`
    }
    return this
  }
  unexpected() {
    this.msg = 'an unexpected error occurred while performing operation'
    return this
  }

  /**
   * return object as is generated by Nest error filter or ValidationPipe
   */
  errorCode(code: HttpStatus.BAD_REQUEST | HttpStatus.NOT_FOUND) {
    const errorMessages = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.NOT_FOUND]: 'Not Found',
    }

    const error = errorMessages[code]

    return {
      message: code === HttpStatus.BAD_REQUEST ? [this.msg] : this.msg,
      error,
      statusCode: code,
    }
  }
}
