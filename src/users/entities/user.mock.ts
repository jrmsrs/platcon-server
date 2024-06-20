import { Role } from './role.enum'
import { User } from './user.entity'
import { CreateUserDto } from '../dto/create-user.dto'

export const userMock: User = {
  id: '1',
  name: 'Test User',
  email: 'user@mail.com',
  password: 'password',
  role: Role.USER,
}

export const producerMock: User = {
  id: '2',
  name: 'Test Producer',
  email: 'producer@email.com',
  password: 'password',
  role: Role.PRODUCER,
}

export const createUserMock: CreateUserDto = {
  name: 'New User',
  email: 'new@mail.com',
  password: 'password',
}
