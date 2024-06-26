import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException as ISEException,
} from '@nestjs/common'

import { MembersRepository } from '#members/members.repository'
import { CreateMemberDto } from '#members/dto/create-member.dto'
import { UpdateMemberDto } from '#members/dto/update-member.dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import {
  StateConflictError,
  UnaffectedError,
  UniqueViolationError,
  NotFoundError,
  FKViolationError,
} from '#utils/errors'

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async create(member: CreateMemberDto) {
    try {
      return await this.membersRepository.create(member)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(
          new ResponseBuilder().member().conflict('stage_name').msg
        )
      }
      if (error instanceof FKViolationError) {
        throw new NotFoundException(
          new ResponseBuilder().member().fkNotFound('User', member.user_id).msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findAll() {
    try {
      return await this.membersRepository.findAll()
    } catch (error) {
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findOne(id: string) {
    try {
      return await this.membersRepository.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(
          new ResponseBuilder().member(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async update(id: string, member: UpdateMemberDto) {
    try {
      await this.membersRepository.update(id, member)
      return new ResponseBuilder().member(id).updated(member)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(
          new ResponseBuilder().member().conflict('stage_name').msg
        )
      }
      if (error instanceof FKViolationError) {
        throw new NotFoundException(
          new ResponseBuilder().member().fkNotFound('User', member.user_id).msg
        )
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(
          new ResponseBuilder().member(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async remove(id: string) {
    try {
      await this.membersRepository.remove(id)
      return new ResponseBuilder().member(id).deleted()
    } catch (error) {
      if (error instanceof StateConflictError) {
        throw new ConflictException(
          new ResponseBuilder().member(id).conflict().msg
        )
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(
          new ResponseBuilder().member(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }
}
