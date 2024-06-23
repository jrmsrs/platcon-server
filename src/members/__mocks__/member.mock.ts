import { faker } from '@faker-js/faker'

import { Member } from '#members/entities/member.entity'

export const memberMock: Member = {
  id: faker.string.uuid(),
  stage_name: faker.person.firstName(),
  desc: faker.lorem.sentence(),
  website: faker.internet.url(),
}
