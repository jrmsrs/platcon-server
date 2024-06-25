import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm'

import { Channel } from '#channels/entities/channel.entity'
import { CreateChannelDto } from '#channels/dto/create-channel.dto'
import { UpdateChannelDto } from '#channels/dto/update-channel.dto'
import { Member } from '#app/members/entities/member.entity'
import { ForeignKeyError } from '#utils/error'

@Injectable()
export class ChannelsRepository {
  constructor(
    @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>
  ) {}

  async create(data: CreateChannelDto): Promise<Channel> {
    let members: Member[]
    let membersCount: number
    if (data.members) {
      ;[members, membersCount] = await this.memberRepository.findAndCount({ where: { id: In(data.members) } })
      if (membersCount !== data.members.length) throw new ForeignKeyError()
    }
    const channel = this.channelRepository.create({ ...data, members })
    return this.channelRepository.save(channel)
  }

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find({ relations: ['members'] })
  }

  async findOne(id: string): Promise<Channel> {
    return this.channelRepository.findOne({ where: { id }, relations: ['members'] })
  }

  async update(id: string, data: UpdateChannelDto): Promise<UpdateResult> {
    let members: Member[]
    let membersCount: number
    if (data.members) {
      ;[members, membersCount] = await this.memberRepository.findAndCount({ where: { id: In(data.members) } })
      if (membersCount !== data.members.length) throw new ForeignKeyError()
    }
    const res = await this.channelRepository.save({ id, ...data, members })
    return { raw: [res], affected: 1 } as UpdateResult
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.channelRepository.delete(id)
  }
}
