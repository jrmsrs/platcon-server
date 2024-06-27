import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { faker } from '@faker-js/faker'
import { PostgresError as PgError } from 'pg-error-enum'

import { ChannelsRepository } from '#channels/channels.repository'
import { Channel } from '#channels/entities/channel.entity'
import { CreateChannelDto, UpdateChannelDto } from '#channels/dto'
import { Member } from '#members/entities/member.entity'
import { channelMock, createChannelMock } from '#channels/__mocks__'
import { memberMock } from '#members/__mocks__'
import {
  NotFoundError,
  FKViolationError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
} from '#utils/errors'

describe('ChannelsRepository', () => {
  let repository: ChannelsRepository
  let channelRepository: Repository<Channel>
  let memberRepository: Repository<Member>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsRepository,
        {
          provide: getRepositoryToken(Channel),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
      ],
    }).compile()

    repository = module.get<ChannelsRepository>(ChannelsRepository)
    channelRepository = module.get<Repository<Channel>>(getRepositoryToken(Channel))
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member))
  })

  describe('insertChannel', () => {
    it('should insert a new channel', async () => {
      const createChannelDto: CreateChannelDto = createChannelMock
      const channel: Channel = {
        ...createChannelMock,
        id: faker.string.uuid(),
        members: [memberMock],
      }
      jest.spyOn(memberRepository, 'findAndCount').mockResolvedValue([[memberMock], 1])
      jest.spyOn(channelRepository, 'create').mockReturnValue(channel)
      jest.spyOn(channelRepository, 'save').mockResolvedValue(channel)

      const result = await repository.create(createChannelDto)

      expect(result).toEqual(channel)
    })

    it('should throw an error if channel already exists', async () => {
      const createChannelDto: CreateChannelDto = createChannelMock
      jest.spyOn(memberRepository, 'findAndCount').mockResolvedValue([[memberMock], 1])
      jest.spyOn(channelRepository, 'create').mockReturnValue(channelMock)
      jest.spyOn(channelRepository, 'save').mockRejectedValue({ driverError: { code: PgError.UNIQUE_VIOLATION } })

      try {
        await repository.create(createChannelDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if a foreign key violation occurs', async () => {
      const createChannelDto: CreateChannelDto = createChannelMock
      jest.spyOn(memberRepository, 'findAndCount').mockResolvedValue([[memberMock], 0])

      try {
        await repository.create(createChannelDto)
      } catch (error) {
        expect(error).toBeInstanceOf(FKViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const createChannelDto: CreateChannelDto = createChannelMock
      jest.spyOn(memberRepository, 'findAndCount').mockRejectedValue(new Error())

      try {
        await repository.create(createChannelDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('findAll', () => {
    it('should return an array of channels', async () => {
      const channels: Channel[] = [channelMock]
      jest.spyOn(channelRepository, 'find').mockResolvedValue(channels)

      const result = await repository.findAll()

      expect(result).toEqual(channels)
    })

    it('should throw an error if an unexpected error occurs', async () => {
      jest.spyOn(channelRepository, 'find').mockRejectedValue(new Error())

      try {
        await repository.findAll()
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('findOne', () => {
    it('should return a channel by id', async () => {
      const id = faker.string.uuid()
      const channel: Channel = channelMock
      jest.spyOn(channelRepository, 'findOne').mockResolvedValue(channel)

      const result = await repository.findOne(id)

      expect(result).toEqual(channel)
    })

    it('should throw an error if channel does not exist', async () => {
      const id = faker.string.uuid()
      jest.spyOn(channelRepository, 'findOne').mockResolvedValue(undefined)

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(channelRepository, 'findOne').mockRejectedValue(new Error())

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('updateChannel', () => {
    it('should update a channel by id', async () => {
      const id = faker.string.uuid()
      const channel = {
        ...channelMock,
        members: [memberMock],
      }
      const updateChannelDto: UpdateChannelDto = { members: [memberMock.id] }
      const updateResult: UpdateResult = { raw: [channel], affected: 1 } as UpdateResult
      jest.spyOn(memberRepository, 'findAndCount').mockResolvedValue([[memberMock], 1])
      jest.spyOn(channelRepository, 'save').mockResolvedValue(channel)
      jest.spyOn(channelRepository, 'count').mockResolvedValue(1)

      const result = await repository.update(id, updateChannelDto)

      expect(result).toEqual(updateResult)
    })

    it('should throw an error if channel already exists', async () => {
      const id = faker.string.uuid()
      const updateChannelDto: UpdateChannelDto = { members: [memberMock.id] }
      jest.spyOn(channelRepository, 'count').mockResolvedValue(1)
      jest.spyOn(memberRepository, 'findAndCount').mockResolvedValue([[memberMock], 1])
      jest.spyOn(channelRepository, 'save').mockRejectedValue({ driverError: { code: PgError.UNIQUE_VIOLATION } })

      try {
        await repository.update(id, updateChannelDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if channel does not exist', async () => {
      const id = faker.string.uuid()
      const updateChannelDto: UpdateChannelDto = { members: [memberMock.id] }
      jest.spyOn(channelRepository, 'count').mockResolvedValue(0)

      try {
        await repository.update(id, updateChannelDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if a foreign key violation occurs', async () => {
      const id = faker.string.uuid()
      const updateChannelDto: UpdateChannelDto = { members: [memberMock.id] }
      jest.spyOn(channelRepository, 'count').mockResolvedValue(1)
      jest.spyOn(memberRepository, 'findAndCount').mockResolvedValue([[memberMock], 0])

      try {
        await repository.update(id, updateChannelDto)
      } catch (error) {
        expect(error).toBeInstanceOf(FKViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      const updateChannelDto: UpdateChannelDto = { members: [memberMock.id] }
      jest.spyOn(channelRepository, 'count').mockRejectedValue(new Error())

      try {
        await repository.update(id, updateChannelDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('removeChannel', () => {
    it('should delete a channel by id', async () => {
      const id = faker.string.uuid()
      const deleteResult: DeleteResult = { raw: [], affected: 1 } as DeleteResult
      jest.spyOn(channelRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.remove(id)

      expect(result).toEqual(deleteResult)
    })

    it('should throw an error if trying to delete a channel with restrict constraint', async () => {
      const id = faker.string.uuid()
      jest.spyOn(channelRepository, 'delete').mockRejectedValue({ name: PgError.FOREIGN_KEY_VIOLATION })

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(StateConflictError)
      }
    })

    it('should throw an error if channel does not exist', async () => {
      const id = faker.string.uuid()
      jest.spyOn(channelRepository, 'delete').mockResolvedValue({ raw: [], affected: 0 })

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(channelRepository, 'delete').mockRejectedValue(new Error())

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })
})
