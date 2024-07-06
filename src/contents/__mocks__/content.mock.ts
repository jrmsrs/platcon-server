import { faker } from '@faker-js/faker'

import { Content } from '#contents/entities/content.entity'
import { channelMock } from '#app/channels/__mocks__'

export const contentMock: Content = {
  id: faker.string.uuid(),
  title: faker.person.firstName(),
  description: faker.lorem.sentence(),
  channel: channelMock,
  body: [],
}
