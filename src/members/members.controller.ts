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

import { MembersService } from '#members/members.service'
import { Member } from '#members/entities/member.entity'
import { CreateMemberDto, UpdateMemberDto, MemberId } from '#members/dto'
import {
  swaggerSuccessRes as success,
  swaggerErrorRes as error,
} from '#utils/swaggerResBuilder.util'

@Controller('members')
@ApiTags('Members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar Membro' })
  @ApiCreatedResponse(success('Membro cadastrado com sucesso', MemberId))
  @ApiBadRequestResponse(error('Bad request / input inválido'))
  @ApiConflictResponse(error('Membro já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({ description: 'Dados do Membro', type: CreateMemberDto })
  async create(@Body() createMember: CreateMemberDto, @Res() apiRes: Response) {
    const serviceRes = await this.membersService.create(createMember)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @Get()
  @ApiOperation({ summary: 'Listar Membros' })
  @ApiOkResponse(success('Membros listados com sucesso', [Member]))
  @ApiISEResponse(error('Erro inesperado'))
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.membersService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Membro por ID' })
  @ApiOkResponse(success('Membro encontrado com sucesso', Member))
  @ApiNotFoundResponse(error('Membro não encontrado'))
  @ApiISEResponse(error('Erro inesperado'))
  async findOne(@Param() params: MemberId, @Res() apiRes: Response) {
    const serviceRes = await this.membersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar Membro por ID' })
  @ApiOkResponse(success('Membro atualizado com sucesso'))
  @ApiBadRequestResponse(error('Bad request / input inválido'))
  @ApiNotFoundResponse(error('Membro não encontrado'))
  @ApiConflictResponse(error('Membro já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({
    description: 'Dados do Membro para atualizar',
    type: UpdateMemberDto,
  })
  async update(
    @Param() params: MemberId,
    @Body() updateMember: UpdateMemberDto,
    @Res() apiRes: Response
  ) {
    const serviceRes = await this.membersService.update(params.id, updateMember)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir Membro por ID' })
  @ApiOkResponse(success('Membro excluído com sucesso'))
  @ApiNotFoundResponse(error('Membro não encontrado'))
  @ApiConflictResponse(error('Membro possui dependências'))
  @ApiISEResponse(error('Erro inesperado'))
  async remove(@Param() params: MemberId, @Res() apiRes: Response) {
    const serviceRes = await this.membersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
