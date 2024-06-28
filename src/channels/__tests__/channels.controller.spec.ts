import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { faker } from '@faker-js/faker'

import { ChannelsController } from '#channels/channels.controller'
import { ChannelsService } from '#channels/channels.service'
import { ChannelsRepository } from '#channels/channels.repository'
import { Channel } from '#channels/entities/channel.entity'
import { CreateChannelDto } from '#channels/dto'
import { channelMock, createChannelMock } from '#channels/__mocks__'
import { memberMock } from '#app/members/__mocks__'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { testController } from '#utils/test/unit'

describe('ChannelsController', () => {
  let controller: ChannelsController
  let channelsService: ChannelsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        ChannelsService,
        { provide: ChannelsRepository, useValue: {} },
      ],
    }).compile()

    controller = module.get<ChannelsController>(ChannelsController)
    channelsService = module.get<ChannelsService>(ChannelsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(channelsService).toBeDefined()
  })

  describe('create', () => {
    it('should create a new channel', async () => {
      const createChannelDto: CreateChannelDto = createChannelMock
      const expectedChannel: Channel = {
        ...createChannelMock,
        id: faker.string.uuid(),
        members: [],
      }
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(channelsService, 'create').mockResolvedValue(expectedChannel)

      await controller.create(createChannelDto, apiRes as unknown as Response)

      testController(
        channelsService.create,
        apiRes,
        HttpStatus.CREATED,
        expectedChannel
      )
    })
  })

  describe('findAll', () => {
    it('should return all channels', async () => {
      const expectedChannels: Channel[] = [channelMock]
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(channelsService, 'findAll').mockResolvedValue(expectedChannels)

      await controller.findAll(apiRes as unknown as Response)

      testController(
        channelsService.findAll,
        apiRes,
        HttpStatus.OK,
        expectedChannels
      )
    })
  })

  describe('findOne', () => {
    it('should return a channel by id', async () => {
      const id = faker.string.uuid()
      const expectedChannel: Channel = channelMock
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(channelsService, 'findOne').mockResolvedValue(expectedChannel)

      await controller.findOne({ id }, apiRes as unknown as Response)

      testController(
        channelsService.findOne,
        apiRes,
        HttpStatus.OK,
        expectedChannel,
        [id]
      )
    })
  })

  describe('update', () => {
    it('should update a channel by id', async () => {
      const id = faker.string.uuid()
      const updateChannelDto = { members: [memberMock.id] }
      const expectedResponse = new ResponseBuilder()
        .channel(id)
        .updated(updateChannelDto)
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(channelsService, 'update').mockResolvedValue(expectedResponse)

      await controller.update(
        { id },
        updateChannelDto,
        apiRes as unknown as Response
      )

      testController(
        channelsService.update,
        apiRes,
        HttpStatus.OK,
        expectedResponse,
        [id, updateChannelDto]
      )
    })
  })

  describe('remove', () => {
    it('should remove a channel by id', async () => {
      const id = faker.string.uuid()
      const expectedResponse = new ResponseBuilder().channel(id).deleted()
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(channelsService, 'remove').mockResolvedValue(expectedResponse)

      await controller.remove({ id }, apiRes as unknown as Response)

      testController(
        channelsService.remove,
        apiRes,
        HttpStatus.OK,
        expectedResponse,
        [id]
      )
    })
  })
})
