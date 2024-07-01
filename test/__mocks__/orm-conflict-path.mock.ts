import { PostgresError as PgError } from 'pg-error-enum'

export const mockOrmRepositoryConflict = jest.fn((obj) => ({
  findAndCount: jest.fn(() => [[obj], 1]),
  findOne: jest.fn(() => obj),
  create: jest.fn(() => {
    throw { driverError: { code: PgError.UNIQUE_VIOLATION } }
  }),
  save: jest.fn(() => {
    throw { driverError: { code: PgError.UNIQUE_VIOLATION } }
  }),
  insert: jest.fn(() => {
    throw { code: PgError.UNIQUE_VIOLATION }
  }),
  update: jest.fn(() => {
    throw { code: PgError.UNIQUE_VIOLATION }
  }),
  delete: jest.fn(() => {
    throw { code: PgError.FOREIGN_KEY_VIOLATION }
  }),
}))
