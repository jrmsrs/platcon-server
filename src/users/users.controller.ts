import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Delete,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiInternalServerErrorResponse as ApiISEResponse,
} from '@nestjs/swagger'

import { UsersService } from '#users/users.service'
import { User } from '#users/entities/user.entity'
import { CreateUserDto, UpdateUserDto, UserId } from '#users/dto'
import { ErrorMessage, SuccessMessage } from '#utils/resBuilder.util'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserId,
  })
  @ApiBadRequestResponse({
    description: 'Bad request / invalid input',
    type: ErrorMessage,
  })
  @ApiConflictResponse({
    description: 'User already exists',
    type: ErrorMessage,
  })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ description: 'User data', type: CreateUserDto })
  async create(@Body() createUser: CreateUserDto, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.create(createUser)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @Get()
  @ApiOkResponse({ description: 'Users retrieved successfully', type: [User] })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Retrieve all users' })
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.usersService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Get(':id')
  @ApiOkResponse({ description: 'User retrieved successfully', type: User })
  @ApiNotFoundResponse({ description: 'User not found', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Retrieve user by ID' })
  async findOne(@Param() params: UserId, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'User updated successfully',
    type: SuccessMessage,
  })
  @ApiBadRequestResponse({
    description: 'Bad request / invalid input',
    type: ErrorMessage,
  })
  @ApiNotFoundResponse({ description: 'User not found', type: ErrorMessage })
  @ApiConflictResponse({
    description: 'User already exists',
    type: ErrorMessage,
  })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({ description: 'User data to update', type: UpdateUserDto })
  async update(
    @Param() params: UserId,
    @Body() updateUser: UpdateUserDto,
    @Res() apiRes: Response
  ) {
    const serviceRes = await this.usersService.update(params.id, updateUser)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: SuccessMessage,
  })
  @ApiNotFoundResponse({ description: 'User not found', type: ErrorMessage })
  @ApiConflictResponse({
    description: 'User has dependencies',
    type: ErrorMessage,
  })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Delete user by ID' })
  async remove(@Param() params: UserId, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
