import { HttpStatus } from '@nestjs/common'

export class ResponseBuilder {
  constructor(public msg = '') {}
  // subjects
  user(id?: string) {
    this.msg += 'User'
    if (id) this.msg += ` id={${id}}`
    return this
  }
  member(id?: string) {
    this.msg += 'Member'
    if (id) this.msg += ` id={${id}}`
    return this
  }

  // success
  updated(where?: any) {
    return { message: this.msg + ` updated successfully, where: ${JSON.stringify(where)}` }
  }
  deleted() {
    return { message: this.msg + ' deleted successfully' }
  }

  // errors
  notFound() {
    this.msg += ' not found'
    return this
  }
  fkNotFound(ref: string, fk: string) {
    this.msg = `${ref} with id={${fk}} does not exist`
    return this
  }
  mustBe(field: string, dataType: string) {
    this.msg += `${field} must be ${dataType}` // x must be a/an y
    return this
  }
  conflict(uniqueField?: string) {
    if (uniqueField) {
      this.msg += ` with ${uniqueField} already exists`
    } else {
      this.msg = `Request with ${this.msg} can't be completed due to a conflict with the current state of the resource`
    }
    return this
  }
  unexpected() {
    this.msg = 'An unexpected error occurred while performing operation'
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
