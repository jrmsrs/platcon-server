import { Controller, Get, Post, Body, Patch, Param, Res, Delete, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { UsersService } from '#users/users.service'
import { User } from '#users/entities/user.entity'
import { CreateUserDto } from '#users/dto/create-user.dto'
import { UpdateUserDto, FindOneParams } from '#users/dto/update-user.dto'
import { ErrorMessage, SuccessMessage } from '#utils/resBuilder.util'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: 'User created successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input', type: ErrorMessage })
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ description: 'User data', type: CreateUserDto })
  @Post()
  async create(@Body() createUser: CreateUserDto, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.create(createUser)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @ApiOkResponse({ description: 'Users retrieved successfully', type: [User] })
  @ApiOperation({ summary: 'Retrieve all users' })
  @Get()
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.usersService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @ApiOkResponse({ description: 'User retrieved successfully', type: User })
  @ApiNotFoundResponse({ description: 'User not found', type: ErrorMessage })
  @ApiOperation({ summary: 'Retrieve user by ID' })
  @Get(':id')
  async findOne(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @ApiOkResponse({ description: 'User updated successfully', type: SuccessMessage })
  @ApiNotFoundResponse({ description: 'User not found', type: ErrorMessage })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input', type: ErrorMessage })
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({ description: 'User data to update', type: UpdateUserDto })
  @Patch(':id')
  async update(@Param() params: FindOneParams, @Body() updateUser: UpdateUserDto, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.update(params.id, updateUser)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @ApiOkResponse({ description: 'User deleted successfully', type: SuccessMessage })
  @ApiNotFoundResponse({ description: 'User not found', type: ErrorMessage })
  @ApiOperation({ summary: 'Delete user by ID' })
  @Delete(':id')
  async remove(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
