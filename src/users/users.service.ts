import { Injectable, NotFoundException } from '@nestjs/common'

import { UsersRepository } from '#users/users.repository'
import { CreateUserDto } from '#users/dto/create-user.dto'
import { UpdateUserDto } from '#users/dto/update-user.dto'
import { ResponseBuilder } from '#utils/resBuilder.util'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({ ...createUserDto })
  }

  async findAll() {
    return this.usersRepository.findAll()
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id)
    if (!user) {
      throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateResult = await this.usersRepository.update(id, updateUserDto)
    if (!updateResult.affected) {
      throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
    }
    return new ResponseBuilder().user(id).updated(updateUserDto)
  }

  async remove(id: string) {
    const deleteResult = await this.usersRepository.remove(id)
    if (!deleteResult.affected) {
      throw new NotFoundException(new ResponseBuilder().user(id).notFound().msg)
    }
    return new ResponseBuilder().user(id).deleted()
  }
}
