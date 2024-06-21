import { userMock } from '../../src/users/__mocks__/user.mock'

export const mockRepository = jest.fn(() => ({
  find: jest.fn(() => [userMock]),
  findOne: jest.fn(() => userMock),
  save: jest.fn(() => userMock),
  update: jest.fn(() => ({ raw: [], affected: 1 })),
  delete: jest.fn(() => ({ raw: [], affected: 1 })),
}))

export const mockRepositoryNotFound = jest.fn(() => ({
  findOne: jest.fn(() => undefined),
  save: jest.fn(() => undefined),
  update: jest.fn(() => ({ raw: [], affected: 0 })),
  delete: jest.fn(() => ({ raw: [], affected: 0 })),
}))
