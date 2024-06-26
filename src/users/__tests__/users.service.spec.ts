import { Test, TestingModule } from '@nestjs/testing'

import { faker } from '@faker-js/faker'

import { UsersService } from '#users/users.service'
import { UsersRepository } from '#users/users.repository'
import { userMock, createUserMock } from '#users/__mocks__'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { mockRepository } from '#utils/mock'
import {
  NotFoundError,
  StateConflictError,
  UnaffectedError,
  UniqueViolationError,
} from '#utils/errors'

describe('UsersService', () => {
  let service: UsersService
  let repository: UsersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository(userMock) },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repository = module.get<UsersRepository>(UsersRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(repository).toBeDefined()
  })

  describe('create', () => {
    it('should create a user', async () => {
      const user = await service.create(createUserMock)
      expect(user).toEqual(userMock)
    })

    it('should throw error on creation if user already exists', async () => {
      repository.create = jest
        .fn()
        .mockRejectedValue(new UniqueViolationError())
      try {
        await service.create(createUserMock)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().user().conflict('email').msg
        )
      }
    })

    it('should throw error on creation if unexpected error occurs', async () => {
      repository.create = jest.fn().mockRejectedValue(new Error())
      try {
        await service.create(createUserMock)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = await service.findAll()
      expect(users).toEqual([userMock])
    })

    it('should throw error on retrieval if unexpected error occurs', async () => {
      repository.findAll = jest.fn().mockRejectedValue(new Error())
      try {
        await service.findAll()
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const user = await service.findOne(userMock.id)
      expect(user).toEqual(userMock)
    })

    it('should throw error on retrieval if user not found', async () => {
      const invalidId = faker.string.uuid()
      repository.findOne = jest.fn().mockRejectedValue(new NotFoundError())
      try {
        await service.findOne(invalidId)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().user(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on retrieval if unexpected error occurs', async () => {
      repository.findOne = jest.fn().mockRejectedValue(new Error())
      try {
        await service.findOne(userMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('update', () => {
    it('should update a user by id', async () => {
      const updateResult = await service.update(userMock.id, {
        name: 'Updated User',
      })
      expect(updateResult).toEqual(
        new ResponseBuilder()
          .user(userMock.id)
          .updated({ name: 'Updated User' })
      )
    })

    it('should throw error on update if user not found', async () => {
      const invalidId = faker.string.uuid()
      repository.update = jest.fn().mockRejectedValue(new UnaffectedError())
      try {
        await service.update(invalidId, { name: 'Updated User' })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().user(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on update if user already exists', async () => {
      repository.update = jest
        .fn()
        .mockRejectedValue(new UniqueViolationError())
      try {
        await service.update(userMock.id, { email: faker.internet.email() })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().user().conflict('email').msg
        )
      }
    })

    it('should throw error on update if unexpected error occurs', async () => {
      repository.update = jest.fn().mockRejectedValue(new Error())
      try {
        await service.update(userMock.id, { name: 'Updated User' })
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const deleteResult = await service.remove(userMock.id)
      expect(deleteResult).toEqual(
        new ResponseBuilder().user(userMock.id).deleted()
      )
    })

    it('should throw error on remove if user not found', async () => {
      const invalidId = faker.string.uuid()
      repository.remove = jest.fn().mockRejectedValue(new UnaffectedError())
      try {
        await service.remove(invalidId)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().user(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on remove if user has related entities', async () => {
      repository.remove = jest.fn().mockRejectedValue(new StateConflictError())
      try {
        await service.remove(userMock.id)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().user(userMock.id).conflict().msg
        )
      }
    })

    it('should throw error on remove if unexpected error occurs', async () => {
      repository.remove = jest.fn().mockRejectedValue(new Error())
      try {
        await service.remove(userMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })
})
