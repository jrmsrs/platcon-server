import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { UsersRepository } from '#users/users.repository'
import { CreateUserDto, UpdateUserDto } from '#users/dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { StateConflictError, UnaffectedError, UniqueViolationError } from '#utils/errors'

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
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findAll() {
    try {
      return await this.usersRepository.findAll()
    } catch (error) {
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOne(id)
    } catch (error) {
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
      }
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, user)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(new ResponseBuilder().user().conflict('email').msg)
      }
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
    return new ResponseBuilder().user(id).updated(user)
  }

  async remove(id: string) {
    try {
      await this.usersRepository.remove(id)
    } catch (error) {
      if (error instanceof StateConflictError) {
        throw new ConflictException(new ResponseBuilder().user(id).conflict().msg)
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
      }
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
    return new ResponseBuilder().user(id).deleted()
  }
}
