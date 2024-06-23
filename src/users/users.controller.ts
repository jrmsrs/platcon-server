import { Controller, Get, Post, Body, Patch, Param, Res, Delete, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { UsersService } from '#users/users.service'
import { User } from '#users/entities/user.entity'
import { CreateUserDto } from '#users/dto/create-user.dto'
import { UpdateUserDto, FindOneParams } from '#users/dto/update-user.dto'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: 'User created successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input' })
  @Post()
  async create(@Body() createUser: CreateUserDto, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.create(createUser)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @ApiOkResponse({ description: 'Users retrieved successfully', type: [User] })
  @Get()
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.usersService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @ApiOkResponse({ description: 'User retrieved successfully', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id')
  async findOne(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input' })
  @Patch(':id')
  async update(@Param() params: FindOneParams, @Body() updateUser: UpdateUserDto, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.update(params.id, updateUser)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete(':id')
  async remove(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
