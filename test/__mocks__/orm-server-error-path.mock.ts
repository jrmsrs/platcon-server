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
