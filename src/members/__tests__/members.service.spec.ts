import { Test, TestingModule } from '@nestjs/testing'

import { faker } from '@faker-js/faker'

import { MembersService } from '#members/members.service'
import { MembersRepository } from '#members/members.repository'
import { memberMock, createMemberMock } from '#members/__mocks__'
import { ResponseBuilder } from '#utils/resBuilder.util'
import {
  NotFoundError,
  FKViolationError,
  StateConflictError,
  UnaffectedError,
  UniqueViolationError,
} from '#utils/errors'
import { mockRepository } from '#utils/mock'

describe('MembersService', () => {
  let service: MembersService
  let repository: MembersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: MembersRepository, useValue: mockRepository(memberMock) },
      ],
    }).compile()

    service = module.get<MembersService>(MembersService)
    repository = module.get<MembersRepository>(MembersRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(repository).toBeDefined()
  })

  describe('create', () => {
    it('should create a member', async () => {
      const member = await service.create(createMemberMock)
      expect(member).toEqual(memberMock)
    })

    it('should throw error on creation if member already exists', async () => {
      repository.create = jest
        .fn()
        .mockRejectedValue(new UniqueViolationError())
      try {
        await service.create(createMemberMock)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().member().conflict('stage_name').msg
        )
      }
    })

    it('should throw error on creation if referenced user does not exist', async () => {
      repository.create = jest.fn().mockRejectedValue(new FKViolationError())
      try {
        await service.create(createMemberMock)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder()
            .member()
            .fkNotFound('User', createMemberMock.user_id).msg
        )
      }
    })

    it('should throw error on creation if unexpected error occurs', async () => {
      repository.create = jest.fn().mockRejectedValue(new Error())
      try {
        await service.create(createMemberMock)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('findAll', () => {
    it('should find all members', async () => {
      const members = await service.findAll()
      expect(members).toEqual([memberMock])
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
    it('should find a member by id', async () => {
      const member = await service.findOne(memberMock.id)
      expect(member).toEqual(memberMock)
    })

    it('should throw error on retrieval if member not found', async () => {
      const invalidId = faker.string.uuid()
      repository.findOne = jest.fn().mockRejectedValue(new NotFoundError())
      try {
        await service.findOne(invalidId)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().member(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on retrieval if unexpected error occurs', async () => {
      repository.findOne = jest.fn().mockRejectedValue(new Error())
      try {
        await service.findOne(memberMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('update', () => {
    it('should update a member by id', async () => {
      const stageName = faker.person.firstName()
      const updateResult = await service.update(memberMock.id, {
        stage_name: stageName,
      })
      expect(updateResult).toEqual(
        new ResponseBuilder()
          .member(memberMock.id)
          .updated({ stage_name: stageName })
      )
    })

    it('should throw error on update if member not found', async () => {
      const invalidId = faker.string.uuid()
      repository.update = jest.fn().mockRejectedValue(new UnaffectedError())
      try {
        await service.update(invalidId, {
          stage_name: faker.person.firstName(),
        })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().member(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on update if member already exists', async () => {
      repository.update = jest
        .fn()
        .mockRejectedValue(new UniqueViolationError())
      try {
        await service.update(memberMock.id, {
          stage_name: faker.person.firstName(),
        })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().member().conflict('stage_name').msg
        )
      }
    })

    it('should throw error on update if referenced user does not exist', async () => {
      const user_id = faker.string.uuid()
      repository.update = jest.fn().mockRejectedValue(new FKViolationError())
      try {
        await service.update(memberMock.id, { user_id })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().member().fkNotFound('User', user_id).msg
        )
      }
    })

    it('should throw error on update if unexpected error occurs', async () => {
      repository.update = jest.fn().mockRejectedValue(new Error())
      try {
        await service.update(memberMock.id, {
          stage_name: faker.person.firstName(),
        })
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('remove', () => {
    it('should remove a member by id', async () => {
      const deleteResult = await service.remove(memberMock.id)
      expect(deleteResult).toEqual(
        new ResponseBuilder().member(memberMock.id).deleted()
      )
    })

    it('should throw error on remove if member not found', async () => {
      const invalidId = faker.string.uuid()
      repository.remove = jest.fn().mockRejectedValue(new UnaffectedError())
      try {
        await service.remove(invalidId)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().member(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on remove if member has related entities', async () => {
      repository.remove = jest.fn().mockRejectedValue(new StateConflictError())
      try {
        await service.remove(memberMock.id)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().member(memberMock.id).conflict().msg
        )
      }
    })

    it('should throw error on remove if unexpected error occurs', async () => {
      repository.remove = jest.fn().mockRejectedValue(new Error())
      try {
        await service.remove(memberMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })
})
