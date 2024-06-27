import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException as ISEException,
} from '@nestjs/common'

import { ChannelsRepository } from '#channels/channels.repository'
import { CreateChannelDto, UpdateChannelDto } from '#channels/dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import {
  FKViolationError,
  StateConflictError,
  UnaffectedError,
  UniqueViolationError,
  NotFoundError,
} from '#utils/errors'

@Injectable()
export class ChannelsService {
  constructor(private readonly channelsRepository: ChannelsRepository) {}

  async create(channel: CreateChannelDto) {
    try {
      return await this.channelsRepository.create(channel)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ConflictException(
          new ResponseBuilder().channel().conflict('name').msg
        )
      }
      if (error instanceof FKViolationError) {
        throw new NotFoundException(
          new ResponseBuilder().channel().fkNotFound('Members').msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findAll() {
    try {
      return await this.channelsRepository.findAll()
    } catch (error) {
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async findOne(id: string) {
    try {
      return await this.channelsRepository.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(
          new ResponseBuilder().channel(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async update(id: string, channel: UpdateChannelDto) {
    try {
      await this.channelsRepository.update(id, channel)
      return new ResponseBuilder().channel(id).updated(channel)
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new ISEException(
          new ResponseBuilder().channel().conflict('name').msg
        )
      }
      if (error instanceof FKViolationError) {
        throw new NotFoundException(
          new ResponseBuilder().channel().fkNotFound('Members').msg
        )
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(
          new ResponseBuilder().channel(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }

  async remove(id: string) {
    try {
      await this.channelsRepository.remove(id)
      return new ResponseBuilder().channel(id).deleted()
    } catch (error) {
      if (error instanceof StateConflictError) {
        throw new ConflictException(
          new ResponseBuilder().channel(id).conflict().msg
        )
      }
      if (error instanceof UnaffectedError) {
        throw new NotFoundException(
          new ResponseBuilder().channel(id).notFound().msg
        )
      }
      throw new ISEException(new ResponseBuilder().unexpected().msg)
    }
  }
}
