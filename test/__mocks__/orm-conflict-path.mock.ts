import { PostgresError as PgError } from 'pg-error-enum'

export const mockOrmRepositoryConflict = jest.fn(() => ({
  insert: jest.fn(() => {
    throw { name: PgError.UNIQUE_VIOLATION }
  }),
  update: jest.fn(() => {
    throw { name: PgError.UNIQUE_VIOLATION }
  }),
  delete: jest.fn(() => {
    throw { name: PgError.FOREIGN_KEY_VIOLATION }
  }),
}))
