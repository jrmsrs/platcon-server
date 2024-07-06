import { faker } from '@faker-js/faker'

import { Content } from '#contents/entities/content.entity'
import { channelMock } from '#app/channels/__mocks__'
import { ContentBody, ContentType } from '../entities/content-body.entity'

export const contentBodyMock: ContentBody = {
  id: faker.string.uuid(),
  type: ContentType.VIDEO,
  value: faker.internet.url(),
}

export const contentMock: Content = {
  id: faker.string.uuid(),
  title: faker.person.firstName(),
  description: faker.lorem.sentence(),
  channel: channelMock,
  body: [],
}
