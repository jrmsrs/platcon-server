import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { Content } from '#contents/entities/content.entity'
import { CreateContentDto } from '#contents/dto/create-content.dto'
import { UpdateContentDto } from '#contents/dto/update-content.dto'
import {
  NotFoundError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
  FKViolationError,
} from '#utils/errors'

@Injectable()
export class ContentsRepository {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>
  ) {}

  async create(data: CreateContentDto): Promise<Content> {
    try {
      const { channel_id, ...procData } = {
        ...data,
        channel: { id: data.channel_id },
      }
      return (await this.contentRepository.insert(procData)).raw[0]
    } catch (error) {
      if (error.code === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      if (error.code === PgError.FOREIGN_KEY_VIOLATION)
        throw new FKViolationError()
      throw new UnexpectedError(error.message)
    }
  }

  async findAll(): Promise<Content[]> {
    try {
      return await this.contentRepository.find({
        relations: {
          channel: true,
        },
      })
    } catch (error) {
      throw new UnexpectedError(error.message)
    }
  }

  async findOne(id: string): Promise<Content> {
    try {
      const res = await this.contentRepository.findOne({
        relations: {
          channel: true,
        },
        where: { id },
      })
      if (!res) throw new NotFoundError()
      return res
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async update(id: string, data: UpdateContentDto): Promise<UpdateResult> {
    try {
      const { channel_id, ...procData } = {
        ...data,
        channel: data.channel_id ? { id: data.channel_id } : undefined,
      }
      const res = await this.contentRepository.update(id, procData)
      if (!res.affected) throw new UnaffectedError()
      return res
    } catch (error) {
      if (error.code === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      if (error.code === PgError.FOREIGN_KEY_VIOLATION)
        throw new FKViolationError()
      if (error instanceof UnaffectedError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const res = await this.contentRepository.delete(id)
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
