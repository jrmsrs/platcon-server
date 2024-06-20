import { Role } from '../entities/role.enum'
import { User } from '../entities/user.entity'

export const userMock: User = {
  id: '1',
  name: 'Test User',
  email: 'user@mail.com',
  password: 'password',
  role: Role.USER,
}
