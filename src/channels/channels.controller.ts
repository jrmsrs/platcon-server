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

import { ChannelsService } from '#channels/channels.service'
import { Channel } from '#channels/entities/channel.entity'
import { CreateChannelDto, UpdateChannelDto, ChannelId } from '#channels/dto'
import {
  swaggerErrorRes as error,
  swaggerSuccessRes as success,
} from '#utils/swaggerResBuilder.util'

@Controller('channels')
@ApiTags('Channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar Canal' })
  @ApiCreatedResponse(success('Canal cadastrado com sucesso', ChannelId))
  @ApiBadRequestResponse(error('Requisição / input inválido'))
  @ApiConflictResponse(error('Canal já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({ description: 'Dados do Canal', type: CreateChannelDto })
  async create(
    @Body() createChannel: CreateChannelDto,
    @Res() apiRes: Response
  ) {
    const serviceRes = await this.channelsService.create(createChannel)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @Get()
  @ApiOperation({ summary: 'Listar Canais' })
  @ApiOkResponse(success('Canais listados com sucesso', [Channel]))
  @ApiISEResponse(error('Erro inesperado'))
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.channelsService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar Canal por ID' })
  @ApiOkResponse(success('Canal encontrado com sucesso', Channel))
  @ApiNotFoundResponse(error('Canal não encontrado'))
  @ApiISEResponse(error('Erro inesperado'))
  async findOne(@Param() params: ChannelId, @Res() apiRes: Response) {
    const serviceRes = await this.channelsService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar Canal por ID' })
  @ApiOkResponse(success('Canal atualizado com sucesso'))
  @ApiBadRequestResponse(error('Requisição / input inválido'))
  @ApiNotFoundResponse(error('Canal não encontrado'))
  @ApiConflictResponse(error('Canal já existe'))
  @ApiISEResponse(error('Erro inesperado'))
  @ApiBody({
    description: 'Dados do Canal para atualizar',
    type: UpdateChannelDto,
  })
  async update(
    @Param() params: ChannelId,
    @Body() updateChannel: UpdateChannelDto,
    @Res() apiRes: Response
  ) {
    const serviceRes = await this.channelsService.update(
      params.id,
      updateChannel
    )
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir Canal por ID' })
  @ApiOkResponse(success('Canal excluído com sucesso'))
  @ApiNotFoundResponse(error('Canal não encontrado'))
  @ApiConflictResponse(error('Canal possui dependências'))
  @ApiISEResponse(error('Erro inesperado'))
  async remove(@Param() params: ChannelId, @Res() apiRes: Response) {
    const serviceRes = await this.channelsService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
