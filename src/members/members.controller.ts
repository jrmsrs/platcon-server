import { Controller, Get, Post, Body, Patch, Param, Res, Delete, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { MembersService } from '#members/members.service'
import { Member } from '#members/entities/member.entity'
import { CreateMemberDto } from '#members/dto/create-member.dto'
import { UpdateMemberDto, FindOneParams } from '#members/dto/update-member.dto'

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiCreatedResponse({ description: 'Member created successfully', type: Member })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input' })
  @Post()
  async create(@Body() createMemberDto: CreateMemberDto, @Res() apiRes: Response) {
    const response = await this.membersService.create(createMemberDto)
    return apiRes.status(HttpStatus.CREATED).send(response)
  }

  @ApiOkResponse({ description: 'Members retrieved successfully', type: [Member] })
  @Get()
  async findAll(@Res() apiRes: Response) {
    const response = await this.membersService.findAll()
    return apiRes.status(HttpStatus.OK).send(response)
  }

  @ApiOkResponse({ description: 'Member retrieved successfully', type: Member })
  @ApiNotFoundResponse({ description: 'Member not found' })
  @Get(':id')
  async findOne(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const response = await this.membersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(response)
  }

  @ApiOkResponse({ description: 'Member updated successfully' })
  @ApiNotFoundResponse({ description: 'Member not found' })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input' })
  @Patch(':id')
  async update(@Param() params: FindOneParams, @Body() updateMemberDto: UpdateMemberDto, @Res() apiRes: Response) {
    const response = await this.membersService.update(params.id, updateMemberDto)
    return apiRes.status(HttpStatus.OK).send(response)
  }

  @ApiOkResponse({ description: 'Member deleted successfully' })
  @ApiNotFoundResponse({ description: 'Member not found' })
  @Delete(':id')
  async remove(@Param() params: FindOneParams, @Res() apiRes: Response) {
    const response = await this.membersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(response)
  }
}
