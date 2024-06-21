import { faker } from '@faker-js/faker'

import { User } from '#users/entities/user.entity'
import { Role } from '#users/enums/role.enum'

export const userMock: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: Role.USER,
}
