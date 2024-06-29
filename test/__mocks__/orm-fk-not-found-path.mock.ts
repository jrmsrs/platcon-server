import { PostgresError as PgError } from 'pg-error-enum'

export const mockOrmRepositoryFKNotFound = jest.fn((obj) => ({
  findOne: jest.fn(() => obj),
  find: jest.fn(() => [obj]),
  findAndCount: jest.fn(() => [[obj], 1]),
  create: jest.fn(() => obj),
  save: jest.fn(() => obj),
  insert: jest.fn(() => {
    throw { name: PgError.FOREIGN_KEY_VIOLATION }
  }),
  update: jest.fn(() => {
    throw { name: PgError.FOREIGN_KEY_VIOLATION }
  }),
}))
