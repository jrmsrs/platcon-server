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

import { MembersService } from '#members/members.service'
import { Member } from '#members/entities/member.entity'
import { CreateMemberDto, UpdateMemberDto, MemberId } from '#members/dto'
import { ErrorMessage, SuccessMessage } from '#utils/resBuilder.util'

@Controller('members')
@ApiTags('Members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Member created successfully', type: MemberId })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input', type: ErrorMessage })
  @ApiConflictResponse({ description: 'Member already exists', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Create member' })
  @ApiBody({ description: 'Member data', type: CreateMemberDto })
  async create(@Body() createMember: CreateMemberDto, @Res() apiRes: Response) {
    const serviceRes = await this.membersService.create(createMember)
    return apiRes.status(HttpStatus.CREATED).send(serviceRes)
  }

  @Get()
  @ApiOkResponse({ description: 'Members retrieved successfully', type: [Member] })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Retrieve all members' })
  async findAll(@Res() apiRes: Response) {
    const serviceRes = await this.membersService.findAll()
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Member retrieved successfully', type: Member })
  @ApiNotFoundResponse({ description: 'Member not found', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Retrieve member by ID' })
  async findOne(@Param() params: MemberId, @Res() apiRes: Response) {
    const serviceRes = await this.membersService.findOne(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Member updated successfully', type: SuccessMessage })
  @ApiBadRequestResponse({ description: 'Bad request / invalid input', type: ErrorMessage })
  @ApiNotFoundResponse({ description: 'Member not found', type: ErrorMessage })
  @ApiConflictResponse({ description: 'Member already exists', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Update member by ID' })
  @ApiBody({ description: 'Member data to update', type: UpdateMemberDto })
  async update(@Param() params: MemberId, @Body() updateMember: UpdateMemberDto, @Res() apiRes: Response) {
    const serviceRes = await this.membersService.update(params.id, updateMember)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Member deleted successfully', type: SuccessMessage })
  @ApiNotFoundResponse({ description: 'Member not found', type: ErrorMessage })
  @ApiConflictResponse({ description: 'Member has dependencies', type: ErrorMessage })
  @ApiISEResponse({ description: 'Unexpected error', type: ErrorMessage })
  @ApiOperation({ summary: 'Delete member by ID' })
  async remove(@Param() params: MemberId, @Res() apiRes: Response) {
    const serviceRes = await this.membersService.remove(params.id)
    return apiRes.status(HttpStatus.OK).send(serviceRes)
  }
}
