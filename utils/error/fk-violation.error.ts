import { ApiError } from '.'

export class FKViolationError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = ApiError.FK_VIOLATION
  }
}
