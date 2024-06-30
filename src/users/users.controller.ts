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
import {
  swaggerSuccessRes as success,
  swaggerErrorRes as error,
} from '#utils/swaggerResBuilder.util'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar Usuário' })
  @ApiCreatedResponse(success('Usuário cadastrado com sucesso', UserId))
  @ApiBadRequestResponse(error('Bad request / input inválido'))
  @ApiConflictResponse(error('Usuário já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({ description: 'Dados do Usuário', type: CreateUserDto })
  async create(@Body() createUser: CreateUserDto, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.create(createUser)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @Get()
  @ApiOperation({ summary: 'Listar Usuários' })
  @ApiOkResponse(success('Usuários listados com sucesso', [User]))
  @ApiISEResponse(error('Erro inesperado'))
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.usersService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Usuário por ID' })
  @ApiOkResponse(success('Usuário encontrado com sucesso', User))
  @ApiNotFoundResponse(error('Usuário não encontrado'))
  @ApiISEResponse(error('Erro inesperado'))
  async findOne(@Param() params: UserId, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar Usuário por ID' })
  @ApiOkResponse(success('Usuário atualizado com sucesso'))
  @ApiBadRequestResponse(error('Bad request / input inválido'))
  @ApiNotFoundResponse(error('Usuário não encontrado'))
  @ApiConflictResponse(error('Usuário já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({
    description: 'Dados do Usuário para atualizar',
    type: UpdateUserDto,
  })
  async update(
    @Param() params: UserId,
    @Body() updateUser: UpdateUserDto,
    @Res() apiRes: Response
  ) {
    const serviceRes = await this.usersService.update(params.id, updateUser)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir Usuário por ID' })
  @ApiOkResponse(success('Usuário excluído com sucesso'))
  @ApiNotFoundResponse(error('Usuário não encontrado'))
  @ApiConflictResponse(error('Usuário possui dependências'))
  @ApiISEResponse(error('Erro inesperado'))
  async remove(@Param() params: UserId, @Res() apiRes: Response) {
    const serviceRes = await this.usersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
