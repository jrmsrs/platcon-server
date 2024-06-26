import { ApiError } from '.'

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = ApiError.NOT_FOUND
  }
}
