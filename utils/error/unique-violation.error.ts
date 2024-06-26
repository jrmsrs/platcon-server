import { ApiError } from '.'

export class UniqueViolationError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = ApiError.UNIQUE_VIOLATION
  }
}
