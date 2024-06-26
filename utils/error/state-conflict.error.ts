import { ApiError } from '.'

export class StateConflictError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = ApiError.STATE_CONFLICT
  }
}
