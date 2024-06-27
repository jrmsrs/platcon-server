import { Controller, Get, Post, Body, Patch, Param, Res, Delete, HttpStatus } from '@nestjs/common'
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
import { ErrorMessage, SuccessMessage } from '#utils/resBuilder.util'

@Controller('channels')
@ApiTags('Channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Channel created successfully', type: ChannelId })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input', type: ErrorMessage })
  @ApiConflictResponse({ description: 'Channel already exists', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Create channel' })
  @ApiBody({ description: 'Channel data', type: CreateChannelDto })
  async create(@Body() createChannel: CreateChannelDto, @Res() apiRes: Response) {
    const serviceRes = await this.channelsService.create(createChannel)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @Get()
  @ApiOkResponse({ description: 'Channels retrieved successfully', type: [Channel] })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Retrieve all channels' })
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.channelsService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Channel retrieved successfully', type: Channel })
  @ApiNotFoundResponse({ description: 'Channel not found', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Retrieve channel by ID' })
  async findOne(@Param() params: ChannelId, @Res() apiRes: Response) {
    const serviceRes = await this.channelsService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Channel updated successfully', type: SuccessMessage })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input', type: ErrorMessage })
  @ApiNotFoundResponse({ description: 'Channel not found', type: ErrorMessage })
  @ApiConflictResponse({ description: 'Channel already exists', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Update channel by ID' })
  @ApiBody({ description: 'Channel data to update', type: UpdateChannelDto })
  async update(@Param() params: ChannelId, @Body() updateChannel: UpdateChannelDto, @Res() apiRes: Response) {
    const serviceRes = await this.channelsService.update(params.id, updateChannel)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Channel deleted successfully', type: SuccessMessage })
  @ApiNotFoundResponse({ description: 'Channel not found', type: ErrorMessage })
  @ApiConflictResponse({ description: 'Channel has dependencies', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Delete channel by ID' })
  async remove(@Param() params: ChannelId, @Res() apiRes: Response) {
    const serviceRes = await this.channelsService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
