import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { DeleteResult, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { MembersRepository } from '#members/members.repository'
import { CreateMemberDto } from '#members/dto/create-member.dto'
import { UpdateMemberDto } from '#members/dto/update-member.dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { Member } from '#members/entities/member.entity'

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async create(member: CreateMemberDto) {
    let createResult: Member

    try {
      createResult = await this.membersRepository.create(member)
    } catch (error) {
      let msg = new ResponseBuilder().unexpected().msg
      if (error.code === PgError.UNIQUE_VIOLATION) {
        msg = new ResponseBuilder().member().conflict('stage_name').msg
      }
      if (error.code === PgError.FOREIGN_KEY_VIOLATION) {
        msg = new ResponseBuilder().member().fkNotFound('User', member.user_id).msg
      }
      throw new UnprocessableEntityException(msg)
    }

    return createResult
  }

  async findAll() {
    return this.membersRepository.findAll()
  }

  async findOne(id: string) {
    const member = await this.membersRepository.findOne(id)
    if (!member) {
      throw new NotFoundException(new ResponseBuilder().member(id).notFound().msg)
    }

    return member
  }

  async update(id: string, member: UpdateMemberDto) {
    let updateResult: UpdateResult

    try {
      updateResult = await this.membersRepository.update(id, member)
    } catch (error) {
      let msg = new ResponseBuilder().unexpected().msg
      if (error.code === PgError.UNIQUE_VIOLATION) {
        msg = new ResponseBuilder().member().conflict('stage_name').msg
      }
      if (error.code === PgError.FOREIGN_KEY_VIOLATION) {
        msg = new ResponseBuilder().member().fkNotFound('User', member.user_id).msg
      }
      throw new UnprocessableEntityException(msg)
    }
    if (!updateResult.affected) {
      throw new NotFoundException(new ResponseBuilder().member(id).notFound().msg)
    }

    return new ResponseBuilder().member(id).updated(member)
  }

  async remove(id: string) {
    let deleteResult: DeleteResult

    try {
      deleteResult = await this.membersRepository.remove(id)
    } catch (error) {
      if (error.code === PgError.FOREIGN_KEY_VIOLATION) {
        throw new ConflictException(new ResponseBuilder().member(id).conflict().msg)
      }
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
    if (!deleteResult.affected) {
      throw new NotFoundException(new ResponseBuilder().member(id).notFound().msg)
    }

    return new ResponseBuilder().member(id).deleted()
  }
}
