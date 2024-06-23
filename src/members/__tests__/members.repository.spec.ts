import { Test, TestingModule } from '@nestjs/testing'

import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult, DeleteResult, InsertResult } from 'typeorm'
import { faker } from '@faker-js/faker'

import { MembersRepository } from '#members/members.repository'
import { Member } from '#members/entities/member.entity'
import { CreateMemberDto } from '#members/dto/create-member.dto'
import { UpdateMemberDto } from '#members/dto/update-member.dto'

import { memberMock } from '#members/__mocks__/member.mock'
import { createMemberMock } from '#members/__mocks__/create-member.mock'

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
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member))
  })

  describe('insertMember', () => {
    it('should insert a new member', async () => {
      const createMemberDto: CreateMemberDto = createMemberMock
      const member: Member = {
        ...createMemberMock,
        id: faker.string.uuid(),
      }
      jest.spyOn(memberRepository, 'insert').mockResolvedValue({ raw: [member] } as InsertResult)

      const result = await repository.create(createMemberDto)

      expect(result).toEqual(member)
    })
  })

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const members: Member[] = [memberMock]
      jest.spyOn(memberRepository, 'find').mockResolvedValue(members)

      const result = await repository.findAll()

      expect(result).toEqual(members)
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
  })

  describe('updateMember', () => {
    it('should update a member by id', async () => {
      const id = faker.string.uuid()
      const updateMemberDto: UpdateMemberDto = { website: faker.internet.url() }
      const updateResult: UpdateResult = { raw: [], affected: 1 } as UpdateResult
      jest.spyOn(memberRepository, 'update').mockResolvedValue(updateResult)

      const result = await repository.update(id, updateMemberDto)

      expect(result).toEqual(updateResult)
    })
  })

  describe('removeMember', () => {
    it('should delete a member by id', async () => {
      const id = faker.string.uuid()
      const deleteResult: DeleteResult = { raw: [], affected: 1 } as DeleteResult
      jest.spyOn(memberRepository, 'delete').mockResolvedValue(deleteResult)

      const result = await repository.remove(id)

      expect(result).toEqual(deleteResult)
    })
  })
})
