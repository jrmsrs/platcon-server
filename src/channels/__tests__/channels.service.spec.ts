import { Test, TestingModule } from '@nestjs/testing'

import { faker } from '@faker-js/faker'

import { ChannelsService } from '#channels/channels.service'
import { ChannelsRepository } from '#channels/channels.repository'
import { channelMock, createChannelMock } from '#channels/__mocks__'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { FKViolationError, StateConflictError, UnaffectedError, UniqueViolationError } from '#utils/errors'
import { mockRepository } from '#utils/mock'

describe('ChannelsService', () => {
  let service: ChannelsService
  let repository: ChannelsRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService, { provide: ChannelsRepository, useValue: mockRepository(channelMock) }],
    }).compile()

    service = module.get<ChannelsService>(ChannelsService)
    repository = module.get<ChannelsRepository>(ChannelsRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(repository).toBeDefined()
  })

  describe('create', () => {
    it('should create a channel', async () => {
      const channel = await service.create(createChannelMock)
      expect(channel).toEqual(channelMock)
    })

    it('should throw error on creation if channel already exists', async () => {
      repository.create = jest.fn().mockRejectedValue(new UniqueViolationError())
      try {
        await service.create(createChannelMock)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel().conflict('name').msg)
      }
    })

    it('should throw error on creation if referenced member does not exist', async () => {
      repository.create = jest.fn().mockRejectedValue(new FKViolationError())
      try {
        await service.create(createChannelMock)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel().fkNotFound('Members').msg)
      }
    })

    it('should throw error on creation if unexpected error occurs', async () => {
      repository.create = jest.fn().mockRejectedValue(new Error())
      try {
        await service.create(createChannelMock)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('findAll', () => {
    it('should find all channels', async () => {
      const channels = await service.findAll()
      expect(channels).toEqual([channelMock])
    })
  })

  describe('findOne', () => {
    it('should find a channel by id', async () => {
      const channel = await service.findOne(channelMock.id)
      expect(channel).toEqual(channelMock)
    })

    it('should throw error on retrieval if channel not found', async () => {
      const invalidId = faker.string.uuid()
      repository.findOne = jest.fn().mockResolvedValue(null)
      try {
        await service.findOne(invalidId)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel(invalidId).notFound().msg)
      }
    })
  })

  describe('update', () => {
    it('should update a channel by id', async () => {
      const name = faker.lorem.word()
      const updateResult = await service.update(channelMock.id, { name: name })
      expect(updateResult).toEqual(new ResponseBuilder().channel(channelMock.id).updated({ name: name }))
    })

    it('should throw error on update if channel not found', async () => {
      const invalidId = faker.string.uuid()
      repository.update = jest.fn().mockResolvedValue({ raw: [], affected: 0 })
      try {
        await service.update(invalidId, { name: faker.lorem.word() })
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel(invalidId).notFound().msg)
      }
    })

    it('should throw error on update if channel already exists', async () => {
      repository.update = jest.fn().mockRejectedValue(new UniqueViolationError())
      try {
        await service.update(channelMock.id, { name: faker.lorem.word() })
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel().conflict('name').msg)
      }
    })

    it('should throw error on update if referenced member does not exist', async () => {
      repository.update = jest.fn().mockRejectedValue(new FKViolationError())
      try {
        await service.update(channelMock.id, { name: faker.lorem.word() })
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel().fkNotFound('Members').msg)
      }
    })

    it('should throw error on update if unexpected error occurs', async () => {
      repository.update = jest.fn().mockRejectedValue(new Error())
      try {
        await service.update(channelMock.id, { name: faker.lorem.word() })
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })

  describe('remove', () => {
    it('should remove a channel by id', async () => {
      const deleteResult = await service.remove(channelMock.id)
      expect(deleteResult).toEqual(new ResponseBuilder().channel(channelMock.id).deleted())
    })

    it('should throw error on remove if channel not found', async () => {
      const invalidId = faker.string.uuid()
      repository.remove = jest.fn().mockResolvedValue(new UnaffectedError())
      try {
        await service.remove(invalidId)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel(invalidId).notFound().msg)
      }
    })

    it('should throw error on remove if channel has related entities', async () => {
      repository.remove = jest.fn().mockRejectedValue(new StateConflictError())
      try {
        await service.remove(channelMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().channel(channelMock.id).conflict().msg)
      }
    })

    it('should throw error on remove if unexpected error occurs', async () => {
      repository.remove = jest.fn().mockRejectedValue(new Error())
      try {
        await service.remove(channelMock.id)
      } catch (error) {
        expect(error.message).toEqual(new ResponseBuilder().unexpected().msg)
      }
    })
  })
})
