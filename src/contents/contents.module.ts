import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { ContentsController } from '#contents/contents.controller'
import { ContentsService } from '#contents/contents.service'
import { ContentsRepository } from '#contents/contents.repository'
import { Content } from '#contents/entities/content.entity'
import { ContentBody } from '#contents/entities/content-body.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentBody])],
  controllers: [ContentsController],
  providers: [ContentsService, ContentsRepository],
})
export class ContentsModule {}
