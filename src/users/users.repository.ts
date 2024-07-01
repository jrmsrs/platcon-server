import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { User } from '#users/entities/user.entity'
import { CreateUserDto, UpdateUserDto } from '#users/dto'
import {
  NotFoundError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
} from '#utils/errors'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      return (await this.userRepository.insert(data)).raw[0]
    } catch (error) {
      if (error.code === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      throw new UnexpectedError(error.message)
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find()
    } catch (error) {
      throw new UnexpectedError(error.message)
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const res = await this.userRepository.findOne({ where: { id } })
      if (!res) throw new NotFoundError()
      return res
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    try {
      const res = await this.userRepository.update(id, data)
      if (!res.affected) throw new UnaffectedError()
      return res
    } catch (error) {
      if (error.code === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      if (error instanceof UnaffectedError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const res = await this.userRepository.delete(id)
      if (!res.affected) throw new UnaffectedError()
      return res
    } catch (error) {
      if (error.code === PgError.FOREIGN_KEY_VIOLATION)
        throw new StateConflictError()
      if (error instanceof UnaffectedError) throw error
      throw new UnexpectedError(error.message)
    }
  }
}
