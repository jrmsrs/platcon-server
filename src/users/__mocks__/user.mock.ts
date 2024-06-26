import { faker } from '@faker-js/faker'

import { User, UserRole } from '#users/entities/user.entity'

export const userMock: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: UserRole.USER,
}
