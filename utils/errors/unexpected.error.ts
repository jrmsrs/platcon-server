import { ApiError } from '.'

export class UnexpectedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = ApiError.UNEXPECTED
  }
}
