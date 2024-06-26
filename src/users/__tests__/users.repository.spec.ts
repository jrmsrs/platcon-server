import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult, InsertResult } from 'typeorm'
import { faker } from '@faker-js/faker'

import { UsersRepository } from '#users/users.repository'
import { User, UserRole } from '#users/entities/user.entity'
import { CreateUserDto, UpdateUserDto } from '#users/dto'
import { userMock, createUserMock } from '#users/__mocks__'

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

  describe('insertUser', () => {
    it('should insert a new user', async () => {
      const createUserDto: CreateUserDto = createUserMock
      const user: User = {
        ...createUserMock,
        role: UserRole.USER,
        id: faker.string.uuid(),
      }
      jest.spyOn(userRepository, 'insert').mockResolvedValue({ raw: [user] } as InsertResult)

      const result = await repository.create(createUserDto)

      expect(result).toEqual(user)
    })
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

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const id = faker.string.uuid()
      const updateUserDto: UpdateUserDto = { password: faker.internet.password() }
      const updateResult: UpdateResult = { raw: [], affected: 1 } as UpdateResult
      jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult)

      const result = await repository.update(id, updateUserDto)

      expect(result).toEqual(updateResult)
    })
  })

  describe('removeUser', () => {
    it('should delete a user by id', async () => {
      const id = faker.string.uuid()
      const deleteResult: DeleteResult = { raw: [], affected: 1 } as DeleteResult
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.remove(id)

      expect(result).toEqual(deleteResult)
    })
  })
})
