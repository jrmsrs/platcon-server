import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { faker } from '@faker-js/faker'

import { buildApp } from '#utils/test/e2e'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { Channel } from '#channels/entities/channel.entity'
import { channelMock } from '#channels/__mocks__'
import {
  mockOrmRepository,
  mockOrmRepositoryServerError,
  mockOrmRepositoryConflict,
  mockOrmRepositoryFKNotFound,
  mockOrmRepositoryNotFound,
} from './__mocks__'
import { Member } from '#app/members/entities/member.entity'
import { memberMock } from '#app/members/__mocks__'

describe('ChannelsModule (e2e)', () => {
  let app: INestApplication

  describe('ChannelsModule (e2e) happy path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepository(channelMock),
          entity: Channel,
        },
        {
          repository: mockOrmRepository(memberMock),
          entity: Member,
        },
      ])
      await app.init()
    })

    it('/channels (GET) :: OK', () => {
      return request(app.getHttpServer())
        .get('/channels')
        .expect(HttpStatus.OK, [channelMock])
    })

    it(`/channels/:id (GET) :: OK`, () => {
      return request(app.getHttpServer())
        .get(`/channels/${channelMock.id}`)
        .expect(HttpStatus.OK, channelMock)
    })

    it('/channels (POST) :: CREATED', () => {
      return request(app.getHttpServer())
        .post('/channels')
        .send({ ...channelMock, members: [channelMock.id] })
        .expect(HttpStatus.CREATED, channelMock)
    })

    it(`/channels/:id (PATCH) :: OK`, () => {
      const partialUpdate = { members: [channelMock.members[0].id] }
      return request(app.getHttpServer())
        .patch(`/channels/${channelMock.id}`)
        .send(partialUpdate)
        .expect(
          HttpStatus.OK,
          new ResponseBuilder().channel(channelMock.id).updated(partialUpdate)
        )
    })

    it(`/channels/:id (DELETE) :: OK`, () => {
      return request(app.getHttpServer())
        .delete(`/channels/${channelMock.id}`)
        .expect(
          HttpStatus.OK,
          new ResponseBuilder().channel(channelMock.id).deleted()
        )
    })
  })

  describe('ChannelsModule (e2e) bad request path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepository(channelMock),
          entity: Channel,
        },
      ])
      await app.init()
    })

    it(`/channels/:id (GET) :: BAD_REQUEST - channel invalid uuid`, () => {
      return request(app.getHttpServer())
        .get(`/channels/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/channels (POST) :: BAD_REQUEST - channel invalid field`, () => {
      return request(app.getHttpServer())
        .post('/channels')
        .send({ ...channelMock, members: [faker.number.int()] })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .each()
            .mustBe('members', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/channels/:id (PATCH) :: BAD_REQUEST - channel non uuid`, () => {
      return request(app.getHttpServer())
        .patch(`/channels/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/channels/:id (PATCH) :: BAD_REQUEST - channel invalid field`, () => {
      return request(app.getHttpServer())
        .patch(`/channels/${channelMock.id}`)
        .send({ members: [faker.number.int()] })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .each()
            .mustBe('members', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/channels/:id (DELETE) :: BAD_REQUEST - channel invalid uuid`, () => {
      return request(app.getHttpServer())
        .delete(`/channels/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })
  })

  describe('ChannelsModule (e2e) not found path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryNotFound(),
          entity: Channel,
        },
      ])
      await app.init()
    })

    it(`/channels/:id (GET) :: NOT_FOUND - channel not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .get(`/channels/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .channel(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/channels/:id (PATCH) :: NOT_FOUND - channel not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/channels/${id}`)
        .send({ name: faker.lorem.word() })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .channel(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/channels/:id (DELETE) :: NOT_FOUND - channel not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .delete(`/channels/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .channel(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })
  })

  describe('ChannelsModule (e2e) conflict path', () => {
    const channelCreateMock = { ...channelMock }
    delete channelCreateMock.members

    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryConflict(channelMock),
          entity: Channel,
        },
      ])
      await app.init()
    })

    it(`/channels (POST) :: CONFLICT - channel already exists`, () => {
      return request(app.getHttpServer())
        .post('/channels')
        .send({ ...channelCreateMock })
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .channel()
            .conflict('name')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/channels/:id (PATCH) :: CONFLICT - channel already exists`, () => {
      return request(app.getHttpServer())
        .patch(`/channels/${channelCreateMock.id}`)
        .send({ name: channelCreateMock.name })
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .channel()
            .conflict('name')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/channels/:id (DELETE) :: CONFLICT - channel has dependencies`, () => {
      return request(app.getHttpServer())
        .delete(`/channels/${channelMock.id}`)
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .channel(channelMock.id)
            .conflict()
            .errorCode(HttpStatus.CONFLICT)
        )
    })
  })

  describe('ChannelsModule (e2e) fk not found path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryFKNotFound(channelMock),
          entity: Channel,
        },
      ])
      await app.init()
    })

    it(`/channels (POST) :: NOT_FOUND - channel has invalid fk`, () => {
      return request(app.getHttpServer())
        .post('/channels')
        .send({ ...channelMock, members: [faker.string.uuid()] })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .channel()
            .fkNotFound('Members')
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/channels/:id (PATCH) :: NOT_FOUND - channel has invalid fk`, () => {
      return request(app.getHttpServer())
        .patch(`/channels/${channelMock.id}`)
        .send({ name: faker.lorem.word(), members: [faker.string.uuid()] })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .channel()
            .fkNotFound('Members')
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })
  })

  describe('ChannelsModule (e2e) ISE path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryServerError(),
          entity: Channel,
        },
        {
          repository: mockOrmRepositoryServerError(),
          entity: Member,
        },
      ])
      await app.init()
    })

    it('/channels (GET) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .get('/channels')
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/channels/:id (GET) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .get(`/channels/${channelMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it('/channels (POST) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .post('/channels')
        .send({ ...channelMock, members: [channelMock.id] })
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/channels/:id (PATCH) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .patch(`/channels/${channelMock.id}`)
        .send({ name: faker.person.fullName() })
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/channels/:id (DELETE) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .delete(`/channels/${channelMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })
  })
})
