import { faker } from '@faker-js/faker'

import { Channel } from '#channels/entities/channel.entity'
import { memberMock } from '#app/members/__mocks__'
import { contentMock } from '#app/contents/__mocks__'

export const channelMock: Channel = {
  id: faker.string.uuid(),
  members: [memberMock],
  name: faker.person.firstName(),
  description: faker.lorem.sentence(),
  tags: [faker.lorem.word()],
  contents: [contentMock],
}
