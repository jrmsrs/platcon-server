import { userMock } from '#users/__mocks__/user.mock'
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm'

export const mockRepository = jest.fn(() => ({
  find: jest.fn(() => [userMock]),
  findOne: jest.fn(() => userMock),
  insert: jest.fn(() => ({ raw: [userMock] }) as InsertResult),
  update: jest.fn(() => ({ raw: [], affected: 1 }) as UpdateResult),
  delete: jest.fn(() => ({ raw: [], affected: 1 }) as DeleteResult),
}))

export const mockRepositoryNotFound = jest.fn(() => ({
  findOne: jest.fn(() => undefined),
  insert: jest.fn(() => ({ raw: [] }) as InsertResult),
  update: jest.fn(() => ({ raw: [], affected: 0 }) as UpdateResult),
  delete: jest.fn(() => ({ raw: [], affected: 0 }) as DeleteResult),
}))
