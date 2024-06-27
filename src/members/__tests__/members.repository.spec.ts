import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult, InsertResult } from 'typeorm'
import { faker } from '@faker-js/faker'
import { PostgresError as PgError } from 'pg-error-enum'

import { MembersRepository } from '#members/members.repository'
import { Member } from '#members/entities/member.entity'
import { CreateMemberDto, UpdateMemberDto } from '#members/dto'
import { memberMock, createMemberMock } from '#members/__mocks__'
import {
  NotFoundError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
} from '#utils/errors'

describe('MembersRepository', () => {
  let repository: MembersRepository
  let memberRepository: Repository<Member>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersRepository,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
      ],
    }).compile()

    repository = module.get<MembersRepository>(MembersRepository)
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member)
    )
  })

  describe('insertMember', () => {
    it('should insert a new member', async () => {
      const createMemberDto: CreateMemberDto = createMemberMock
      const member: Member = {
        ...createMemberMock,
        id: faker.string.uuid(),
      }
      jest
        .spyOn(memberRepository, 'insert')
        .mockResolvedValue({ raw: [member] } as InsertResult)

      const result = await repository.create(createMemberDto)

      expect(result).toEqual(member)
    })

    it('should throw an error if member already exists', async () => {
      const createMemberDto: CreateMemberDto = createMemberMock
      jest
        .spyOn(memberRepository, 'insert')
        .mockRejectedValue({ name: PgError.UNIQUE_VIOLATION })

      try {
        await repository.create(createMemberDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const createMemberDto: CreateMemberDto = createMemberMock
      jest.spyOn(memberRepository, 'insert').mockRejectedValue(new Error())

      try {
        await repository.create(createMemberDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const members: Member[] = [memberMock]
      jest.spyOn(memberRepository, 'find').mockResolvedValue(members)

      const result = await repository.findAll()

      expect(result).toEqual(members)
    })

    it('should throw an error if an unexpected error occurs', async () => {
      jest.spyOn(memberRepository, 'find').mockRejectedValue(new Error())

      try {
        await repository.findAll()
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('findOne', () => {
    it('should return a member by id', async () => {
      const id = faker.string.uuid()
      const member: Member = memberMock
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue(member)

      const result = await repository.findOne(id)

      expect(result).toEqual(member)
    })

    it('should throw an error if member is not found', async () => {
      const id = faker.string.uuid()
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue(null)

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(memberRepository, 'findOne').mockRejectedValue(new Error())

      try {
        await repository.findOne(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('updateMember', () => {
    it('should update a member by id', async () => {
      const id = faker.string.uuid()
      const updateMemberDto: UpdateMemberDto = {
        website: [faker.internet.url()],
      }
      const updateResult: UpdateResult = {
        raw: [],
        affected: 1,
      } as UpdateResult
      jest.spyOn(memberRepository, 'update').mockResolvedValue(updateResult)

      const result = await repository.update(id, updateMemberDto)

      expect(result).toEqual(updateResult)
    })

    it('should throw an error if member is not found', async () => {
      const id = faker.string.uuid()
      const updateMemberDto: UpdateMemberDto = {
        website: [faker.internet.url()],
      }
      jest
        .spyOn(memberRepository, 'update')
        .mockResolvedValue({ raw: [], affected: 0 } as UpdateResult)

      try {
        await repository.update(id, updateMemberDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if member already exists', async () => {
      const id = faker.string.uuid()
      const updateMemberDto: UpdateMemberDto = {
        website: [faker.internet.url()],
      }
      jest
        .spyOn(memberRepository, 'update')
        .mockRejectedValue({ name: PgError.UNIQUE_VIOLATION })

      try {
        await repository.update(id, updateMemberDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UniqueViolationError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      const updateMemberDto: UpdateMemberDto = {
        website: [faker.internet.url()],
      }
      jest.spyOn(memberRepository, 'update').mockRejectedValue(new Error())

      try {
        await repository.update(id, updateMemberDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })

  describe('removeMember', () => {
    it('should delete a member by id', async () => {
      const id = faker.string.uuid()
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      } as DeleteResult
      jest.spyOn(memberRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.remove(id)

      expect(result).toEqual(deleteResult)
    })

    it('should throw an error if member is not found', async () => {
      const id = faker.string.uuid()
      jest
        .spyOn(memberRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 0 } as DeleteResult)

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnaffectedError)
      }
    })

    it('should throw an error if trying to delete a member with restrict constraint', async () => {
      const id = faker.string.uuid()
      jest
        .spyOn(memberRepository, 'delete')
        .mockRejectedValue({ name: PgError.FOREIGN_KEY_VIOLATION })

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(StateConflictError)
      }
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const id = faker.string.uuid()
      jest.spyOn(memberRepository, 'delete').mockRejectedValue(new Error())

      try {
        await repository.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedError)
      }
    })
  })
})
