import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users.service'
import { UsersRepository } from '../users.repository'
import { userMock } from '../__mocks__/user.mock'
import { createUserMock } from '../__mocks__/createUser.mock'

describe('UsersService', () => {
  let service: UsersService
  let repository: UsersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            insertUser: jest.fn().mockResolvedValue(userMock),
            findAll: jest.fn().mockResolvedValue([userMock]),
            findOne: jest.fn().mockResolvedValue(userMock),
            updateUser: jest.fn().mockResolvedValue({ raw: [], affected: 1 }),
            removeUser: jest.fn().mockResolvedValue({ raw: [], affected: 1 }),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repository = module.get<UsersRepository>(UsersRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(repository).toBeDefined()
  })

  it('should create a user', async () => {
    const user = await service.create(createUserMock)
    expect(user).toEqual(userMock)
  })

  it('should find all users', async () => {
    const users = await service.findAll()
    expect(users).toEqual([userMock])
  })

  it('should find a user by id', async () => {
    const user = await service.findOne(userMock.id)
    expect(user).toEqual(userMock)
  })

  it('should throw error on retrieval if user not found', async () => {
    repository.findOne = jest.fn().mockResolvedValue(null)
    try {
      await service.findOne('invalid-id')
    } catch (error) {
      expect(error.message).toEqual('User id={invalid-id} not found')
    }
  })

  it('should update a user by id', async () => {
    const updateResult = await service.update(userMock.id, { name: 'Updated User' })
    expect(updateResult).toEqual(`User id={${userMock.id}} updated successfully, where: {"name":"Updated User"}`)
  })

  it('should throw error on update if user not found', async () => {
    repository.updateUser = jest.fn().mockResolvedValue({ raw: [], affected: 0 })
    try {
      await service.update('invalid-id', { name: 'Updated User' })
    } catch (error) {
      expect(error.message).toEqual('User id={invalid-id} not found')
    }
  })

  it('should remove a user by id', async () => {
    const deleteResult = await service.remove(userMock.id)
    expect(deleteResult).toEqual(`User id={${userMock.id}} deleted successfully`)
  })

  it('should throw error on remove if user not found', async () => {
    repository.removeUser = jest.fn().mockResolvedValue({ raw: [], affected: 0 })
    try {
      await service.remove('invalid-id')
    } catch (error) {
      expect(error.message).toEqual('User id={invalid-id} not found')
    }
  })
})
