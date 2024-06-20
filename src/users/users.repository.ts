import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } })
  }

  async insertUser(data: CreateUserDto): Promise<User> {
    return this.userRepository.save(data)
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, data)
  }

  async removeUser(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id)
  }
}
