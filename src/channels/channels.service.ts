import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

import { DeleteResult, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { ChannelsRepository } from '#channels/channels.repository'
import { CreateChannelDto } from '#channels/dto/create-channel.dto'
import { UpdateChannelDto } from '#channels/dto/update-channel.dto'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { Channel } from '#channels/entities/channel.entity'

@Injectable()
export class ChannelsService {
  constructor(private readonly channelsRepository: ChannelsRepository) {}

  async create(channel: CreateChannelDto) {
    let createResult: Channel

    try {
      createResult = await this.channelsRepository.create(channel)
    } catch (error) {
      console.log(error.code)
      let msg = new ResponseBuilder().unexpected().msg
      if (error.code === PgError.UNIQUE_VIOLATION) {
        msg = new ResponseBuilder().channel().conflict('name').msg
      }
      if (error.code === PgError.FOREIGN_KEY_VIOLATION) {
        msg = new ResponseBuilder().channel().fkNotFound('Members').msg
      }
      throw new UnprocessableEntityException(msg)
    }

    return createResult
  }

  async findAll() {
    return this.channelsRepository.findAll()
  }

  async findOne(id: string) {
    const channel = await this.channelsRepository.findOne(id)
    if (!channel) {
      throw new NotFoundException(new ResponseBuilder().channel(id).notFound().msg)
    }

    return channel
  }

  async update(id: string, channel: UpdateChannelDto) {
    let updateResult: UpdateResult

    try {
      updateResult = await this.channelsRepository.update(id, channel)
    } catch (error) {
      let msg = new ResponseBuilder().unexpected().msg
      if (error.code === PgError.UNIQUE_VIOLATION) {
        msg = new ResponseBuilder().channel().conflict('name').msg
      }
      if (error.code === PgError.FOREIGN_KEY_VIOLATION) {
        msg = new ResponseBuilder().channel().fkNotFound('Members').msg
      }
      throw new UnprocessableEntityException(msg)
    }
    if (!updateResult.affected) {
      throw new NotFoundException(new ResponseBuilder().channel(id).notFound().msg)
    }

    return new ResponseBuilder().channel(id).updated(channel)
  }

  async remove(id: string) {
    let deleteResult: DeleteResult

    try {
      deleteResult = await this.channelsRepository.remove(id)
    } catch (error) {
      if (error.code === PgError.FOREIGN_KEY_VIOLATION) {
        throw new ConflictException(new ResponseBuilder().channel(id).conflict().msg)
      }
      throw new UnprocessableEntityException(new ResponseBuilder().unexpected().msg)
    }
    if (!deleteResult.affected) {
      throw new NotFoundException(new ResponseBuilder().channel(id).notFound().msg)
    }

    return new ResponseBuilder().channel(id).deleted()
  }
}
