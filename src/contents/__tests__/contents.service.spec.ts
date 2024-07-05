import { Test, TestingModule } from '@nestjs/testing'

import { faker } from '@faker-js/faker'

import { ContentsService } from '#contents/contents.service'
import { ContentsRepository } from '#contents/contents.repository'
import { contentMock, createContentMock } from '#contents/__mocks__'
import { ResponseBuilder } from '#utils/resBuilder.util'
import {
  NotFoundError,
  FKViolationError,
  StateConflictError,
  UnaffectedError,
  UniqueViolationError,
} from '#utils/errors'
import { mockRepository } from '#utils/mock'

describe('ContentsService', () => {
  let service: ContentsService
  let repository: ContentsRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentsService,
        { provide: ContentsRepository, useValue: mockRepository(contentMock) },
      ],
    }).compile()

    service = module.get<ContentsService>(ContentsService)
    repository = module.get<ContentsRepository>(ContentsRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(repository).toBeDefined()
  })

  describe('create', () => {
    it('should create a content', async () => {
      const content = await service.create(createContentMock)
      expect(content).toEqual(contentMock)
    })

    it('should throw error on creation if content already exists', async () => {
      repository.create = jest
        .fn()
        .mockRejectedValue(new UniqueViolationError())
      try {
        await service.create(createContentMock)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().content().conflict('title').msg
        )
      }
    })

    it('should throw error on creation if referenced channel does not exist', async () => {
      repository.create = jest.fn().mockRejectedValue(new FKViolationError())
      try {
        await service.create(createContentMock)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder()
            .content()
            .fkNotFound('Channel', createContentMock.channel_id).msg
        )
      }
    })

    it('should throw error on creation if unexpected error occurs', async () => {
      repository.create = jest.fn().mockRejectedValue(new Error())
      try {
        await service.create(createContentMock)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('findAll', () => {
    it('should find all contents', async () => {
      const contents = await service.findAll()
      expect(contents).toEqual([contentMock])
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
    it('should find a content by id', async () => {
      const content = await service.findOne(contentMock.id)
      expect(content).toEqual(contentMock)
    })

    it('should throw error on retrieval if content not found', async () => {
      const invalidId = faker.string.uuid()
      repository.findOne = jest.fn().mockRejectedValue(new NotFoundError())
      try {
        await service.findOne(invalidId)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().content(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on retrieval if unexpected error occurs', async () => {
      repository.findOne = jest.fn().mockRejectedValue(new Error())
      try {
        await service.findOne(contentMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('update', () => {
    it('should update a content by id', async () => {
      const title = faker.lorem.word()
      const updateResult = await service.update(contentMock.id, { title })
      expect(updateResult).toEqual(
        new ResponseBuilder().content(contentMock.id).updated({ title })
      )
    })

    it('should throw error on update if content not found', async () => {
      const invalidId = faker.string.uuid()
      repository.update = jest.fn().mockRejectedValue(new UnaffectedError())
      try {
        await service.update(invalidId, {
          title: faker.lorem.word(),
        })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().content(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on update if content already exists', async () => {
      repository.update = jest
        .fn()
        .mockRejectedValue(new UniqueViolationError())
      try {
        await service.update(contentMock.id, {
          title: faker.lorem.word(),
        })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().content().conflict('title').msg
        )
      }
    })

    it('should throw error on update if referenced channel does not exist', async () => {
      const channel_id = faker.string.uuid()
      repository.update = jest.fn().mockRejectedValue(new FKViolationError())
      try {
        await service.update(contentMock.id, { channel_id })
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().content().fkNotFound('Channel', channel_id).msg
        )
      }
    })

    it('should throw error on update if unexpected error occurs', async () => {
      repository.update = jest.fn().mockRejectedValue(new Error())
      try {
        await service.update(contentMock.id, {
          title: faker.lorem.word(),
        })
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('remove', () => {
    it('should remove a content by id', async () => {
      const deleteResult = await service.remove(contentMock.id)
      expect(deleteResult).toEqual(
        new ResponseBuilder().content(contentMock.id).deleted()
      )
    })

    it('should throw error on remove if content not found', async () => {
      const invalidId = faker.string.uuid()
      repository.remove = jest.fn().mockRejectedValue(new UnaffectedError())
      try {
        await service.remove(invalidId)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().content(invalidId).notFound().msg
        )
      }
    })

    it('should throw error on remove if content has related entities', async () => {
      repository.remove = jest.fn().mockRejectedValue(new StateConflictError())
      try {
        await service.remove(contentMock.id)
      } catch (error) {
        expect(error.message).toEqual(
          new ResponseBuilder().content(contentMock.id).conflict().msg
        )
      }
    })

    it('should throw error on remove if unexpected error occurs', async () => {
      repository.remove = jest.fn().mockRejectedValue(new Error())
      try {
        await service.remove(contentMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })
})
