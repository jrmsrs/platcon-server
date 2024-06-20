import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult } from 'typeorm'
import { UsersRepository } from './users.repository'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { createUserMock, userMock } from './entities/user.mock'
import { Role } from './entities/role.enum'

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
      const id = 'test-id'
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
        id: '1',
      }
      jest.spyOn(userRepository, 'save').mockResolvedValue(user)

      const result = await repository.insertUser(createUserDto)

      expect(result).toEqual(user)
    })
  })

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const id = 'test-id'
      const updateUserDto: UpdateUserDto = { password: 'new-password' }
      const updateResult: UpdateResult = { raw: [], affected: 1 } as UpdateResult
      jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult)

      const result = await repository.updateUser(id, updateUserDto)

      expect(result).toEqual(updateResult)
    })
  })

  describe('removeUser', () => {
    it('should delete a user by id', async () => {
      const id = 'test-id'
      const deleteResult: DeleteResult = { raw: [], affected: 1 } as DeleteResult
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.removeUser(id)

      expect(result).toEqual(deleteResult)
    })
  })
})
