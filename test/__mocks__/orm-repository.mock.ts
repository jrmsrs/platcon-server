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
