import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { faker } from '@faker-js/faker'

import { MembersController } from '#members/members.controller'
import { MembersService } from '#members/members.service'
import { MembersRepository } from '#members/members.repository'
import { Member } from '#members/entities/member.entity'
import { CreateMemberDto } from '#members/dto'

import { memberMock, createMemberMock } from '#members/__mocks__'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { testController } from '#utils/test/unit'

describe('MembersController', () => {
  let controller: MembersController
  let membersService: MembersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [MembersService, { provide: MembersRepository, useValue: {} }],
    }).compile()

    controller = module.get<MembersController>(MembersController)
    membersService = module.get<MembersService>(MembersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(membersService).toBeDefined()
  })

  describe('create', () => {
    it('should create a new member', async () => {
      const createMemberDto: CreateMemberDto = createMemberMock
      const expectedMember: Member = {
        ...createMemberMock,
        id: faker.string.uuid(),
      }
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(membersService, 'create').mockResolvedValue(expectedMember)

      await controller.create(createMemberDto, apiRes as unknown as Response)

      testController(
        membersService.create,
        apiRes,
        HttpStatus.CREATED,
        expectedMember
      )
    })
  })

  describe('findAll', () => {
    it('should return all members', async () => {
      const expectedMembers: Member[] = [memberMock]
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(membersService, 'findAll').mockResolvedValue(expectedMembers)

      await controller.findAll(apiRes as unknown as Response)

      testController(
        membersService.findAll,
        apiRes,
        HttpStatus.OK,
        expectedMembers
      )
    })
  })

  describe('findOne', () => {
    it('should return a member by id', async () => {
      const id = faker.string.uuid()
      const expectedMember: Member = memberMock
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(membersService, 'findOne').mockResolvedValue(expectedMember)

      await controller.findOne({ id }, apiRes as unknown as Response)

      testController(
        membersService.findOne,
        apiRes,
        HttpStatus.OK,
        expectedMember,
        [id]
      )
    })
  })

  describe('update', () => {
    it('should update a member by id', async () => {
      const id = faker.string.uuid()
      const updateMemberDto = { website: [faker.internet.url()] }
      const expectedResponse = new ResponseBuilder()
        .member(id)
        .updated(updateMemberDto)
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(membersService, 'update').mockResolvedValue(expectedResponse)

      await controller.update(
        { id },
        updateMemberDto,
        apiRes as unknown as Response
      )

      testController(
        membersService.update,
        apiRes,
        HttpStatus.OK,
        expectedResponse,
        [id, updateMemberDto]
      )
    })
  })

  describe('remove', () => {
    it('should remove a member by id', async () => {
      const id = faker.string.uuid()
      const expectedResponse = new ResponseBuilder().member(id).deleted()
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(membersService, 'remove').mockResolvedValue(expectedResponse)

      await controller.remove({ id }, apiRes as unknown as Response)

      testController(
        membersService.remove,
        apiRes,
        HttpStatus.OK,
        expectedResponse,
        [id]
      )
    })
  })
})
