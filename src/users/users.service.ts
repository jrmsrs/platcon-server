import { Injectable, NotFoundException } from '@nestjs/common'

import { UsersRepository } from '#users/users.repository'
import { CreateUserDto } from '#users/dto/create-user.dto'
import { UpdateUserDto } from '#users/dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.insertUser({ ...createUserDto })
  }

  async findAll() {
    return this.usersRepository.findAll()
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id)
    if (!user) {
      throw new NotFoundException(`User id={${id}} not found`)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateResult = await this.usersRepository.updateUser(id, updateUserDto)
    if (!updateResult.affected) {
      throw new NotFoundException(`User id={${id}} not found`)
    }
    return `User id={${id}} updated successfully, where: ${JSON.stringify(updateUserDto)}`
  }

  async remove(id: string) {
    const deleteResult = await this.usersRepository.removeUser(id)
    if (!deleteResult.affected) {
      throw new NotFoundException(`User id={${id}} not found`)
    }
    return `User id={${id}} deleted successfully`
  }
}
