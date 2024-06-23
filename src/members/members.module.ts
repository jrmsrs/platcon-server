import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { MembersController } from '#members/members.controller'
import { MembersService } from '#members/members.service'
import { MembersRepository } from '#members/members.repository'
import { Member } from '#members/entities/member.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [MembersService, MembersRepository],
})
export class MembersModule {}
