import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm'
import { PostgresError as PgError } from 'pg-error-enum'

import { Channel } from '#channels/entities/channel.entity'
import { CreateChannelDto, UpdateChannelDto } from '#channels/dto'
import { Member } from '#members/entities/member.entity'
import {
  NotFoundError,
  FKViolationError,
  StateConflictError,
  UnaffectedError,
  UnexpectedError,
  UniqueViolationError,
} from '#utils/errors'

@Injectable()
export class ChannelsRepository {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  async create(data: CreateChannelDto): Promise<Channel> {
    try {
      let members: Member[]
      let membersCount: number
      if (data.members?.length) {
        ;[members, membersCount] = await this.memberRepository.findAndCount({
          where: { id: In(data.members) },
        })
        if (membersCount !== data.members.length) throw new FKViolationError()
      }
      const channel = this.channelRepository.create({ ...data, members })
      return await this.channelRepository.save(channel)
    } catch (error) {
      if (error.driverError?.code === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      if (error instanceof FKViolationError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async findAll(): Promise<Channel[]> {
    try {
      return await this.channelRepository.find({ relations: ['members'] })
    } catch (error) {
      throw new UnexpectedError(error.message)
    }
  }

  async findOne(id: string): Promise<Channel> {
    try {
      const res = await this.channelRepository.findOne({
        where: { id },
        relations: ['members'],
      })
      if (!res) throw new NotFoundError()
      return res
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async update(id: string, data: UpdateChannelDto): Promise<UpdateResult> {
    try {
      if (
        (await this.channelRepository.findOne({ where: { id } })) === undefined
      )
        throw new UnaffectedError()
      let members: Member[]
      let membersCount: number
      if (data.members?.length) {
        ;[members, membersCount] = await this.memberRepository.findAndCount({
          where: { id: In(data.members) },
        })
        if (membersCount !== data.members.length) throw new FKViolationError()
      }
      const res = await this.channelRepository.save({ id, ...data, members })
      return { raw: [res], affected: 1 } as UpdateResult // temporary
    } catch (error) {
      if (error.driverError?.code === PgError.UNIQUE_VIOLATION)
        throw new UniqueViolationError()
      if (error instanceof UnaffectedError) throw error
      if (error instanceof FKViolationError) throw error
      throw new UnexpectedError(error.message)
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const res = await this.channelRepository.delete(id)
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
