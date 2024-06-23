import { faker } from '@faker-js/faker'

import { CreateMemberDto } from '#members/dto/create-member.dto'

export const createMemberMock: CreateMemberDto = {
  stage_name: faker.person.firstName(),
  description: faker.lorem.sentence(),
}
