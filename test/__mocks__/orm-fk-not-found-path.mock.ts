import { PostgresError as PgError } from 'pg-error-enum'

export const mockOrmRepositoryFKNotFound = jest.fn(() => ({
  insert: jest.fn(() => {
    throw { name: PgError.FOREIGN_KEY_VIOLATION }
  }),
  update: jest.fn(() => {
    throw { name: PgError.FOREIGN_KEY_VIOLATION }
  }),
}))
