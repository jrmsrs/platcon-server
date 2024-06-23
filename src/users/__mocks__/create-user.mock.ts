import { faker } from '@faker-js/faker'

import { CreateUserDto } from '#users/dto/create-user.dto'

export const createUserMock: CreateUserDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}
