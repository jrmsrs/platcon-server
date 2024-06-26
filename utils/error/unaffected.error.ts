import { ApiError } from '.'

export class UnaffectedError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = ApiError.UNAFFECTED
  }
}
