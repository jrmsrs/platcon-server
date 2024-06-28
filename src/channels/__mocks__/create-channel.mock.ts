import { faker } from '@faker-js/faker'

import { CreateChannelDto } from '#channels/dto/create-channel.dto'
import { memberMock } from '#app/members/__mocks__'

export const createChannelMock: CreateChannelDto = {
  members: [memberMock.id],
  name: faker.person.firstName(),
  description: faker.lorem.sentence(),
  tags: [faker.lorem.word()],
}
