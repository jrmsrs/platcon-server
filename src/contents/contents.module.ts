import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { ContentsController } from '#contents/contents.controller'
import { ContentsService } from '#contents/contents.service'
import { ContentsRepository } from '#contents/contents.repository'
import { Content } from '#contents/entities/content.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  controllers: [ContentsController],
  providers: [ContentsService, ContentsRepository],
})
export class ContentsModule {}
