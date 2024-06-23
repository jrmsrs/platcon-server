export const mockRepository = jest.fn((obj) => ({
  create: jest.fn().mockResolvedValue(obj),
  findAll: jest.fn().mockResolvedValue([obj]),
  findOne: jest.fn().mockResolvedValue(obj),
  update: jest.fn().mockResolvedValue({ raw: [], affected: 1 }),
  remove: jest.fn().mockResolvedValue({ raw: [], affected: 1 }),
}))
