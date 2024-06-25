import { PostgresError as PgError } from 'pg-error-enum'

export class ForeignKeyError extends Error {
  constructor() {
    super()
  }
  code = PgError.FOREIGN_KEY_VIOLATION
}
