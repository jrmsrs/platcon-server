import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { faker } from '@faker-js/faker'

import { ContentsController } from '#contents/contents.controller'
import { ContentsService } from '#contents/contents.service'
import { ContentsRepository } from '#contents/contents.repository'
import { Content } from '#contents/entities/content.entity'
import { CreateContentDto } from '#contents/dto'

import { contentMock, createContentMock } from '#contents/__mocks__'
import { channelMock } from '#app/channels/__mocks__'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { testController } from '#utils/test/unit'

describe('ContentsController', () => {
  let controller: ContentsController
  let contentsService: ContentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentsController],
      providers: [
        ContentsService,
        { provide: ContentsRepository, useValue: {} },
      ],
    }).compile()

    controller = module.get<ContentsController>(ContentsController)
    contentsService = module.get<ContentsService>(ContentsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(contentsService).toBeDefined()
  })

  describe('create', () => {
    it('should create a new content', async () => {
      const createContentDto: CreateContentDto = createContentMock
      const expectedContent: Content = {
        ...createContentMock,
        id: faker.string.uuid(),
        channel: channelMock,
      }
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(contentsService, 'create').mockResolvedValue(expectedContent)

      await controller.create(createContentDto, apiRes as unknown as Response)

      testController(
        contentsService.create,
        apiRes,
        HttpStatus.CREATED,
        expectedContent
      )
    })
  })

  describe('findAll', () => {
    it('should return all contents', async () => {
      const expectedContents: Content[] = [contentMock]
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(contentsService, 'findAll').mockResolvedValue(expectedContents)

      await controller.findAll(apiRes as unknown as Response)

      testController(
        contentsService.findAll,
        apiRes,
        HttpStatus.OK,
        expectedContents
      )
    })
  })

  describe('findOne', () => {
    it('should return a content by id', async () => {
      const id = faker.string.uuid()
      const expectedContent: Content = contentMock
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(contentsService, 'findOne').mockResolvedValue(expectedContent)

      await controller.findOne({ id }, apiRes as unknown as Response)

      testController(
        contentsService.findOne,
        apiRes,
        HttpStatus.OK,
        expectedContent,
        [id]
      )
    })
  })

  describe('update', () => {
    it('should update a content by id', async () => {
      const id = faker.string.uuid()
      const updateContentDto = { description: faker.lorem.sentence() }
      const expectedResponse = new ResponseBuilder()
        .content(id)
        .updated(updateContentDto)
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(contentsService, 'update').mockResolvedValue(expectedResponse)

      await controller.update(
        { id },
        updateContentDto,
        apiRes as unknown as Response
      )

      testController(
        contentsService.update,
        apiRes,
        HttpStatus.OK,
        expectedResponse,
        [id, updateContentDto]
      )
    })
  })

  describe('remove', () => {
    it('should remove a content by id', async () => {
      const id = faker.string.uuid()
      const expectedResponse = new ResponseBuilder().content(id).deleted()
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(contentsService, 'remove').mockResolvedValue(expectedResponse)

      await controller.remove({ id }, apiRes as unknown as Response)

      testController(
        contentsService.remove,
        apiRes,
        HttpStatus.OK,
        expectedResponse,
        [id]
      )
    })
  })
})
