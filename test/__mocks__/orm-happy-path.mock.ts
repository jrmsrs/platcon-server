import { DeleteResult, InsertResult, UpdateResult } from 'typeorm'

export const mockOrmRepository = jest.fn((obj) => ({
  find: jest.fn(() => [obj]),
  findOne: jest.fn(() => obj),
  insert: jest.fn(() => ({ raw: [obj] }) as InsertResult),
  update: jest.fn(() => ({ raw: [], affected: 1 }) as UpdateResult),
  delete: jest.fn(() => ({ raw: [], affected: 1 }) as DeleteResult),
}))
