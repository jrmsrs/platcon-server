import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { faker } from '@faker-js/faker'

import { ChannelsRepository } from '#channels/channels.repository'
import { Channel } from '#channels/entities/channel.entity'
import { CreateChannelDto } from '#channels/dto/create-channel.dto'
import { UpdateChannelDto } from '#channels/dto/update-channel.dto'
import { Member } from '#members/entities/member.entity'

import { channelMock } from '#channels/__mocks__/channel.mock'
import { createChannelMock } from '#channels/__mocks__/create-channel.mock'
import { memberMock } from '#members/__mocks__/member.mock'

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
  })

  describe('findAll', () => {
    it('should return an array of channels', async () => {
      const channels: Channel[] = [channelMock]
      jest.spyOn(channelRepository, 'find').mockResolvedValue(channels)

      const result = await repository.findAll()

      expect(result).toEqual(channels)
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

      const result = await repository.update(id, updateChannelDto)

      expect(result).toEqual(updateResult)
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
  })
})
