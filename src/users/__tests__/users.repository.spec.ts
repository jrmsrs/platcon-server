import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult } from 'typeorm'
import { faker } from '@faker-js/faker'

import { UsersRepository } from '#users/users.repository'
import { User } from '#users/entities/user.entity'
import { Role } from '#users/enums/role.enum'
import { CreateUserDto } from '#users/dto/create-user.dto'
import { UpdateUserDto } from '#users/dto/update-user.dto'

import { userMock } from '#users/__mocks__/user.mock'
import { createUserMock } from '#users/__mocks__/createUser.mock'

describe('UsersRepository', () => {
  let repository: UsersRepository
  let userRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile()

    repository = module.get<UsersRepository>(UsersRepository)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [userMock]
      jest.spyOn(userRepository, 'find').mockResolvedValue(users)

      const result = await repository.findAll()

      expect(result).toEqual(users)
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = faker.string.uuid()
      const user: User = userMock
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user)

      const result = await repository.findOne(id)

      expect(result).toEqual(user)
    })
  })

  describe('insertUser', () => {
    it('should insert a new user', async () => {
      const createUserDto: CreateUserDto = createUserMock
      const user: User = {
        ...createUserMock,
        role: Role.USER,
        id: faker.string.uuid(),
      }
      jest.spyOn(userRepository, 'save').mockResolvedValue(user)

      const result = await repository.insertUser(createUserDto)

      expect(result).toEqual(user)
    })
  })

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const id = faker.string.uuid()
      const updateUserDto: UpdateUserDto = { password: faker.internet.password() }
      const updateResult: UpdateResult = { raw: [], affected: 1 } as UpdateResult
      jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult)

      const result = await repository.updateUser(id, updateUserDto)

      expect(result).toEqual(updateResult)
    })
  })

  describe('removeUser', () => {
    it('should delete a user by id', async () => {
      const id = faker.string.uuid()
      const deleteResult: DeleteResult = { raw: [], affected: 1 } as DeleteResult
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.removeUser(id)

      expect(result).toEqual(deleteResult)
    })
  })
})
