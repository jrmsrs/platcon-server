import { CreateUserDto } from '../dto/create-user.dto'
import { faker } from '@faker-js/faker'

export const createUserMock: CreateUserDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}
