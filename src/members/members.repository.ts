import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { Member } from '#members/entities/member.entity'
import { CreateMemberDto } from '#members/dto/create-member.dto'
import { UpdateMemberDto } from '#members/dto/update-member.dto'
import {
  NotFoundError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
  FKViolationError,
} from '#utils/errors'

@Injectable()
export class MembersRepository {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  async create(data: CreateMemberDto): Promise<Member> {
    try {
      return (await this.memberRepository.insert(data)).raw[0]
    } catch (error) {
      if (error.name === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      if (error.name === PgError.FOREIGN_KEY_VIOLATION)
        throw new FKViolationError()
      throw new UnexpectedError(error.message)
    }
  }

  async findAll(): Promise<Member[]> {
    try {
      return await this.memberRepository.find({
        relations: ['channels'],
      })
    } catch (error) {
      throw new UnexpectedError(error.message)
    }
  }

  async findOne(id: string): Promise<Member> {
    try {
      const res = await this.memberRepository.findOne({
        relations: ['channels'],
        where: { id },
      })
      if (!res) throw new NotFoundError()
      return res
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async update(id: string, data: UpdateMemberDto): Promise<UpdateResult> {
    try {
      const res = await this.memberRepository.update(id, data)
      if (!res.affected) throw new UnaffectedError()
      return res
    } catch (error) {
      if (error.name === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      if (error.name === PgError.FOREIGN_KEY_VIOLATION)
        throw new FKViolationError()
      if (error instanceof UnaffectedError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const res = await this.memberRepository.delete(id)
      if (!res.affected) throw new UnaffectedError()
      return res
    } catch (error) {
      if (error.name === PgError.FOREIGN_KEY_VIOLATION)
        throw new StateConflictError()
      if (error instanceof UnaffectedError) throw error
      throw new UnexpectedError(error.message)
    }
  }
}
