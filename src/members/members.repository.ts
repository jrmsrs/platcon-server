import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'

import { Member } from '#members/entities/member.entity'
import { CreateMemberDto } from '#members/dto/create-member.dto'
import { UpdateMemberDto } from '#members/dto/update-member.dto'

@Injectable()
export class MembersRepository {
  constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>) {}

  async create(data: CreateMemberDto): Promise<Member> {
    return (await this.memberRepository.insert(data)).raw[0]
  }

  async findAll(): Promise<Member[]> {
    return this.memberRepository.find({
      relations: ['channels'],
    })
  }

  async findOne(id: string): Promise<Member> {
    return this.memberRepository.findOne({
      relations: ['channels'],
      where: { id },
    })
  }

  async update(id: string, data: UpdateMemberDto): Promise<UpdateResult> {
    return await this.memberRepository.update(id, data)
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.memberRepository.delete(id)
  }
}
