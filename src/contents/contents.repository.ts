import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import {
  DeleteResult,
  Repository,
  UpdateResult,
  UpdateValuesMissingError,
} from 'typeorm'
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
import { ContentBody } from './entities/content-body.entity'

@Injectable()
export class ContentsRepository {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(ContentBody)
    private readonly contentBodyRepository: Repository<ContentBody>
  ) {}

  async create(data: CreateContentDto): Promise<Content> {
    try {
      const { channel_id, ...procData } = {
        ...data,
        channel: { id: data.channel_id },
        body: [],
      }
      const createContentRes = (await this.contentRepository.insert(procData))
        .raw[0]
      if (data.body) {
        await Promise.all(
          data.body.map((body) =>
            this.contentBodyRepository.insert({
              ...body,
              content: { id: createContentRes.id },
            })
          )
        ).catch((error) => {
          throw new UnexpectedError(error.message)
        })
      }
      return createContentRes
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
          body: true,
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
          body: true,
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
      const { channel_id, body, ...procData } = {
        ...data,
        channel: data.channel_id ? { id: data.channel_id } : undefined,
      }
      let res = { affected: 0 } as UpdateResult
      try {
        res = await this.contentRepository.update(id, procData)
      } catch (error) {
        if (!(error instanceof UpdateValuesMissingError)) throw error
      }
      if (data.body) {
        await this.contentBodyRepository.delete({ content: { id } })
        await Promise.all(
          data.body.map((body) =>
            this.contentBodyRepository.insert({
              ...body,
              content: { id },
            })
          )
        ).catch((error) => {
          throw new UnexpectedError(error.message)
        })
        res.affected++
      }
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
