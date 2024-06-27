import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException as ISEException,
} from '@nestjs/common'

import { UsersRepository } from '#users/users.repository'
import { CreateUserDto, UpdateUserDto } from '#users/dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { NotFoundError, StateConflictError, UnaffectedError, UniqueViolationError } from '#utils/errors'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: CreateUserDto) {
    try {
      return await this.usersRepository.create(user)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(new ResponseBuilder().user().conflict('email').msg)
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findAll() {
    try {
      return await this.usersRepository.findAll()
    } catch (error) {
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, user)
      return new ResponseBuilder().user(id).updated(user)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(new ResponseBuilder().user().conflict('email').msg)
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async remove(id: string) {
    try {
      await this.usersRepository.remove(id)
      return new ResponseBuilder().user(id).deleted()
    } catch (error) {
      if (error instanceof StateConflictError) {
        throw new ConflictException(new ResponseBuilder().user(id).conflict().msg)
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }
}
