import { DeleteResult, InsertResult, UpdateResult } from 'typeorm'

export const mockOrmRepositoryNotFound = jest.fn(() => ({
  findOne: jest.fn(() => undefined),
  insert: jest.fn(() => ({ raw: [] }) as InsertResult),
  update: jest.fn(() => ({ raw: [], affected: 0 }) as UpdateResult),
  delete: jest.fn(() => ({ raw: [], affected: 0 }) as DeleteResult),
}))
