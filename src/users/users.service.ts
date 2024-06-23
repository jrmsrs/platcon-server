import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { DeleteResult, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { UsersRepository } from '#users/users.repository'
import { CreateUserDto } from '#users/dto/create-user.dto'
import { UpdateUserDto } from '#users/dto/update-user.dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { User } from '#users/entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: CreateUserDto) {
    let createResult: User

    try {
      createResult = await this.usersRepository.create(user)
    } catch (error) {
      let msg = new ResponseBuilder().unexpected().msg
      if (error.code === PgError.UNIQUE_VIOLATION) {
        msg = new ResponseBuilder().user().conflict('email').msg
      }
      throw new UnprocessableEntityException(msg)
    }

    return createResult
  }

  async findAll() {
    return this.usersRepository.findAll()
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id)
    if (!user) {
      throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
    }

    return user
  }

  async update(id: string, user: UpdateUserDto) {
    let updateResult: UpdateResult

    try {
      updateResult = await this.usersRepository.update(id, user)
    } catch (error) {
      let msg = new ResponseBuilder().unexpected().msg
      if (error.code === PgError.UNIQUE_VIOLATION) {
        msg = new ResponseBuilder().user().conflict('email').msg
      }
      throw new UnprocessableEntityException(msg)
    }
    if (!updateResult.affected) {
      throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
    }

    return new ResponseBuilder().user(id).updated(user)
  }

  async remove(id: string) {
    let deleteResult: DeleteResult

    try {
      deleteResult = await this.usersRepository.remove(id)
    } catch (error) {
      if (error.code === PgError.FOREIGN_KEY_VIOLATION) {
        throw new ConflictException(new ResponseBuilder().user(id).conflict().msg)
      }
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
    if (!deleteResult.affected) {
      throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
    }

    return new ResponseBuilder().user(id).deleted()
  }
}
