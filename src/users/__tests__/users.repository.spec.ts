import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult, InsertResult } from 'typeorm'
import { faker } from '@faker-js/faker'
import { PostgresError as PgError } from 'pg-error-enum'

import { UsersRepository } from '#users/users.repository'
import { User, UserRole } from '#users/entities/user.entity'
import { CreateUserDto, UpdateUserDto } from '#users/dto'
import { userMock, createUserMock } from '#users/__mocks__'

import {
  NotFoundError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
} from '#utils/errors'

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
      jest
        .spyOn(userRepository, 'insert')
        .mockResolvedValue({ raw: [user] } as InsertResult)

      const result = await repository.create(createUserDto)

      expect(result).toEqual(user)
    })

    it('should throw an error if user already exists', async () => {
      const createUserDto: CreateUserDto = createUserMock
      jest
        .spyOn(userRepository, 'insert')
        .mockRejectedValue({ code: PgError.UNIQUE_VIOLATION })

      try {
        await repository.create(createUserDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const createUserDto: CreateUserDto = createUserMock
      jest.spyOn(userRepository, 'insert').mockRejectedValue(new Error())

      try {
        await repository.create(createUserDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [userMock]
      jest.spyOn(userRepository, 'find').mockResolvedValue(users)

      const result = await repository.findAll()

      expect(result).toEqual(users)
    })

    it('should throw an error if an unexpected error occurs', async () => {
      jest.spyOn(userRepository, 'find').mockRejectedValue(new Error())

      try {
        await repository.findAll()
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
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

    it('should throw an error if user is not found', async () => {
      const id = faker.string.uuid()
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined)

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error())

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const id = faker.string.uuid()
      const updateUserDto: UpdateUserDto = {
        password: faker.internet.password(),
      }
      const updateResult: UpdateResult = {
        raw: [],
        affected: 1,
      } as UpdateResult
      jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult)

      const result = await repository.update(id, updateUserDto)

      expect(result).toEqual(updateResult)
    })

    it('should throw an error if user is not found', async () => {
      const id = faker.string.uuid()
      const updateUserDto: UpdateUserDto = {
        password: faker.internet.password(),
      }
      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue({ raw: [], affected: 0 } as UpdateResult)

      try {
        await repository.update(id, updateUserDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if user already exists', async () => {
      const id = faker.string.uuid()
      const updateUserDto: UpdateUserDto = { email: faker.internet.email() }
      jest
        .spyOn(userRepository, 'update')
        .mockRejectedValue({ code: PgError.UNIQUE_VIOLATION })

      try {
        await repository.update(id, updateUserDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      const updateUserDto: UpdateUserDto = {
        password: faker.internet.password(),
      }
      jest.spyOn(userRepository, 'update').mockRejectedValue(new Error())

      try {
        await repository.update(id, updateUserDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('removeUser', () => {
    it('should delete a user by id', async () => {
      const id = faker.string.uuid()
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      } as DeleteResult
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.remove(id)

      expect(result).toEqual(deleteResult)
    })

    it('should throw an error if user is not found', async () => {
      const id = faker.string.uuid()
      jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 0 } as DeleteResult)

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if trying to delete user with restrict constraint', async () => {
      const id = faker.string.uuid()
      jest
        .spyOn(userRepository, 'delete')
        .mockRejectedValue({ code: PgError.FOREIGN_KEY_VIOLATION })

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(StateConflictError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(userRepository, 'delete').mockRejectedValue(new Error())

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })
})
