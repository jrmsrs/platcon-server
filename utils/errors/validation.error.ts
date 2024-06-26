import { ApiError } from '.'

export class ValidationError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = ApiError.VALIDATION
  }
}
