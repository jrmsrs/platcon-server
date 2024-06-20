import { Role } from '../entities/role.enum'
import { User } from '../entities/user.entity'
import { faker } from '@faker-js/faker'

export const userMock: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: Role.USER,
}
