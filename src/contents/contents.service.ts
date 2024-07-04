import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException as ISEException,
} from '@nestjs/common'

import { ContentsRepository } from '#contents/contents.repository'
import { CreateContentDto } from '#contents/dto/create-content.dto'
import { UpdateContentDto } from '#contents/dto/update-content.dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import {
  StateConflictError,
  UnaffectedError,
  UniqueViolationError,
  NotFoundError,
  FKViolationError,
} from '#utils/errors'

@Injectable()
export class ContentsService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async create(content: CreateContentDto) {
    try {
      return await this.contentsRepository.create(content)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(
          new ResponseBuilder().content().conflict('title').msg
        )
      }
      if (error instanceof FKViolationError) {
        throw new NotFoundException(
          new ResponseBuilder()
            .content()
            .fkNotFound('Channel', content.channel_id).msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findAll() {
    try {
      return await this.contentsRepository.findAll()
    } catch (error) {
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findOne(id: string) {
    try {
      return await this.contentsRepository.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(
          new ResponseBuilder().content(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async update(id: string, content: UpdateContentDto) {
    try {
      await this.contentsRepository.update(id, content)
      return new ResponseBuilder().content(id).updated(content)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(
          new ResponseBuilder().content().conflict('title').msg
        )
      }
      if (error instanceof FKViolationError) {
        throw new NotFoundException(
          new ResponseBuilder()
            .content()
            .fkNotFound('Channel', content.channel_id).msg
        )
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(
          new ResponseBuilder().content(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async remove(id: string) {
    try {
      await this.contentsRepository.remove(id)
      return new ResponseBuilder().content(id).deleted()
    } catch (error) {
      if (error instanceof StateConflictError) {
        throw new ConflictException(
          new ResponseBuilder().content(id).conflict().msg
        )
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(
          new ResponseBuilder().content(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }
}
