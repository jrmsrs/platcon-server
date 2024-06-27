import { PostgresError as PgError } from 'pg-error-enum'
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm'

export const mockOrmRepository = jest.fn((obj) => ({
  find: jest.fn(() => [obj]),
  findOne: jest.fn(() => obj),
  insert: jest.fn(() => ({ raw: [obj] }) as InsertResult),
  update: jest.fn(() => ({ raw: [], affected: 1 }) as UpdateResult),
  delete: jest.fn(() => ({ raw: [], affected: 1 }) as DeleteResult),
}))

export const mockOrmRepositoryNotFound = jest.fn(() => ({
  findOne: jest.fn(() => undefined),
  insert: jest.fn(() => ({ raw: [] }) as InsertResult),
  update: jest.fn(() => ({ raw: [], affected: 0 }) as UpdateResult),
  delete: jest.fn(() => ({ raw: [], affected: 0 }) as DeleteResult),
}))

export const mockOrmRepositoryFKNotFound = jest.fn(() => ({
  insert: jest.fn(() => {
    throw { name: PgError.FOREIGN_KEY_VIOLATION }
  }),
  update: jest.fn(() => {
    throw { name: PgError.FOREIGN_KEY_VIOLATION }
  }),
}))

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

export const mockOrmRepositoryServerError = jest.fn(() => ({
  find: jest.fn(() => {
    throw new Error()
  }),
  findOne: jest.fn(() => {
    throw new Error()
  }),
  insert: jest.fn(() => {
    throw new Error()
  }),
  update: jest.fn(() => {
    throw new Error()
  }),
  delete: jest.fn(() => {
    throw new Error()
  }),
}))
