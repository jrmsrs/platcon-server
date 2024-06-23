import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { faker } from '@faker-js/faker'

import { UsersController } from '#users/users.controller'
import { UsersService } from '#users/users.service'
import { UsersRepository } from '#users/users.repository'
import { User } from '#users/entities/user.entity'
import { Role } from '#users/enums/role.enum'
import { CreateUserDto } from '#users/dto/create-user.dto'

import { userMock } from '#users/__mocks__/user.mock'
import { createUserMock } from '#users/__mocks__/create-user.mock'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { testController } from '#utils/test/testController.util'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: UsersRepository, useValue: {} }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(usersService).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = createUserMock
      const expectedUser: User = {
        ...createUserMock,
        role: Role.USER,
        id: faker.string.uuid(),
      }
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(usersService, 'create').mockResolvedValue(expectedUser)

      await controller.create(createUserDto, apiRes as unknown as Response)

      testController(usersService.create, apiRes, HttpStatus.CREATED, expectedUser, [createUserDto])
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedUsers: User[] = [userMock]
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(usersService, 'findAll').mockResolvedValue(expectedUsers)

      await controller.findAll(apiRes as unknown as Response)

      testController(usersService.findAll, apiRes, HttpStatus.OK, expectedUsers)
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = faker.string.uuid()
      const expectedUser: User = userMock
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(usersService, 'findOne').mockResolvedValue(expectedUser)

      await controller.findOne({ id }, apiRes as unknown as Response)

      testController(usersService.findOne, apiRes, HttpStatus.OK, expectedUser, [id])
    })
  })

  describe('update', () => {
    it('should update a user by id', async () => {
      const id = faker.string.uuid()
      const updateUserDto = { password: faker.internet.password() }
      const expectedResponse = new ResponseBuilder().user(id).updated(updateUserDto)
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(usersService, 'update').mockResolvedValue(expectedResponse)

      await controller.update({ id }, updateUserDto, apiRes as unknown as Response)

      testController(usersService.update, apiRes, HttpStatus.OK, expectedResponse, [id, updateUserDto])
    })
  })

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const id = faker.string.uuid()
      const expectedResponse = new ResponseBuilder().user(id).deleted()
      const apiRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }

      jest.spyOn(usersService, 'remove').mockResolvedValue(expectedResponse)

      await controller.remove({ id }, apiRes as unknown as Response)

      testController(usersService.remove, apiRes, HttpStatus.OK, expectedResponse, [id])
    })
  })
})
