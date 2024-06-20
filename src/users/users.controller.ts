import { Controller, Get, Post, Body, Patch, Param, Res, Delete, HttpStatus } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto, FindOneParams } from './dto/update-user.dto'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { Response } from 'express'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: 'User created successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() apiRes: Response) {
    const response = await this.usersService.create(createUserDto)
    return apiRes.status(HttpStatus.CREATED).send(response)
  }

  @ApiOkResponse({ description: 'Users retrieved successfully', type: [User] })
  @Get()
  async findAll(@Res() apiRes: Response) {
    const response = await this.usersService.findAll()
    return apiRes.status(HttpStatus.OK).send(response)
  }

  @ApiOkResponse({ description: 'User retrieved successfully', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id')
  async findOne(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const response = await this.usersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(response)
  }

  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input' })
  @Patch(':id')
  async update(@Param() params: FindOneParams, @Body() updateUserDto: UpdateUserDto, @Res() apiRes: Response) {
    const response = await this.usersService.update(params.id, updateUserDto)
    return apiRes.status(HttpStatus.OK).send(response)
  }

  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete(':id')
  async remove(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const response = await this.usersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(response)
  }
}
