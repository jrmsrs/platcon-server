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

import { ContentsService } from '#contents/contents.service'
import { Content } from '#contents/entities/content.entity'
import { CreateContentDto, UpdateContentDto, ContentId } from '#contents/dto'
import {
  swaggerSuccessRes as success,
  swaggerErrorRes as error,
} from '#utils/swaggerResBuilder.util'

@Controller('contents')
@ApiTags('Contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar Conteúdo' })
  @ApiCreatedResponse(success('Conteúdo cadastrado com sucesso', ContentId))
  @ApiBadRequestResponse(error('Bad request / input inválido'))
  @ApiConflictResponse(error('Conteúdo já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({ description: 'Dados do Conteúdo', type: CreateContentDto })
  async create(
    @Body() createContent: CreateContentDto,
    @Res() apiRes: Response
  ) {
    const serviceRes = await this.contentsService.create(createContent)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @Get()
  @ApiOperation({ summary: 'Listar Conteúdos' })
  @ApiOkResponse(success('Conteúdos listados com sucesso', [Content]))
  @ApiISEResponse(error('Erro inesperado'))
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.contentsService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Conteúdo por ID' })
  @ApiOkResponse(success('Conteúdo encontrado com sucesso', Content))
  @ApiNotFoundResponse(error('Conteúdo não encontrado'))
  @ApiISEResponse(error('Erro inesperado'))
  async findOne(@Param() params: ContentId, @Res() apiRes: Response) {
    const serviceRes = await this.contentsService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar Conteúdo por ID' })
  @ApiOkResponse(success('Conteúdo atualizado com sucesso'))
  @ApiBadRequestResponse(error('Bad request / input inválido'))
  @ApiNotFoundResponse(error('Conteúdo não encontrado'))
  @ApiConflictResponse(error('Conteúdo já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({
    description: 'Dados do Conteúdo para atualizar',
    type: UpdateContentDto,
  })
  async update(
    @Param() params: ContentId,
    @Body() updateContent: UpdateContentDto,
    @Res() apiRes: Response
  ) {
    const serviceRes = await this.contentsService.update(
      params.id,
      updateContent
    )
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir Conteúdo por ID' })
  @ApiOkResponse(success('Conteúdo excluído com sucesso'))
  @ApiNotFoundResponse(error('Conteúdo não encontrado'))
  @ApiConflictResponse(error('Conteúdo possui dependências'))
  @ApiISEResponse(error('Erro inesperado'))
  async remove(@Param() params: ContentId, @Res() apiRes: Response) {
    const serviceRes = await this.contentsService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
