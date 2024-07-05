import { faker } from '@faker-js/faker'

import { CreateContentDto } from '#contents/dto'

export const createContentMock: CreateContentDto = {
  title: faker.lorem.word(),
  description: faker.lorem.sentence(),
  channel_id: faker.string.uuid(),
}
