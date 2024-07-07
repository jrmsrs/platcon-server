import { faker } from '@faker-js/faker'

import { CreateContentDto, CreateContentBodyDto } from '#contents/dto'
import { ContentType } from '../entities/content-body.entity'
import { channelMock } from '#app/channels/__mocks__'

export const createContentBodyMock: CreateContentBodyDto = {
  type: ContentType.VIDEO,
  value: faker.internet.url(),
}

export const createContentMock: CreateContentDto = {
  title: faker.lorem.word(),
  description: faker.lorem.sentence(),
  channel_id: channelMock?.id || faker.string.uuid(),
}
