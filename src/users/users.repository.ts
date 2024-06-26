import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { User } from '#users/entities/user.entity'
import { CreateUserDto } from '#users/dto/create-user.dto'
import { UpdateUserDto } from '#users/dto/update-user.dto'
import { StateConflictError, UnaffectedError, UnexpectedError, UniqueViolationError } from '#utils/error'

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      return (await this.userRepository.insert(data)).raw[0]
    } catch (error) {
      if (error.name === PgError.UNIQUE_VIOLATION) throw new UniqueViolationError()
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
      return await this.userRepository.findOne({ where: { id } })
    } catch (error) {
      throw new UnexpectedError(error.message)
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    try {
      return await this.userRepository.update(id, data)
    } catch (error) {
      if (error.name === PgError.UNIQUE_VIOLATION) throw new UniqueViolationError()
      throw new UnexpectedError(error.message)
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const res = await this.userRepository.delete(id)
      if (!res.affected) throw new UnaffectedError()
      return res
    } catch (error) {
      if (error.name === PgError.FOREIGN_KEY_VIOLATION) throw new StateConflictError()
      if (error instanceof UnaffectedError) throw error
      throw new UnexpectedError(error.message)
    }
  }
}
