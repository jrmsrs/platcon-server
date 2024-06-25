import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { ChannelsController } from '#channels/channels.controller'
import { ChannelsService } from '#channels/channels.service'
import { ChannelsRepository } from '#channels/channels.repository'
import { Channel } from '#channels/entities/channel.entity'
import { Member } from '#app/members/entities/member.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Member])],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsRepository],
})
export class ChannelsModule {}
