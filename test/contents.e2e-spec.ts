import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { faker } from '@faker-js/faker'

import { buildApp } from '#utils/test/e2e'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { Content } from '#contents/entities/content.entity'
import {
  contentBodyMock,
  contentMock,
  createContentBodyMock,
  createContentMock,
} from '#contents/__mocks__'
import {
  mockOrmRepository,
  mockOrmRepositoryServerError,
  mockOrmRepositoryConflict,
  mockOrmRepositoryNotFound,
  mockOrmRepositoryFKNotFound,
} from './__mocks__'
import { ContentBody } from '#app/contents/entities/content-body.entity'
import { channelMock } from '#app/channels/__mocks__'
import { Channel } from '#app/channels/entities/channel.entity'

describe('ContentsModule (e2e)', () => {
  let app: INestApplication

  describe('ContentsModule (e2e) happy path', () => {
    const contentResponse: Content = {
      ...contentMock,
      channel: channelMock,
      body: [contentBodyMock],
    }

    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepository(contentResponse),
          entity: Content,
        },
        {
          repository: mockOrmRepository(channelMock),
          entity: Channel,
        },
        {
          repository: mockOrmRepository(contentBodyMock),
          entity: ContentBody,
        },
      ])
      await app.init()
    })

    it('/contents (GET) :: OK', () => {
      return request(app.getHttpServer())
        .get('/contents')
        .expect(HttpStatus.OK, JSON.stringify([contentResponse]))
    })

    it(`/contents/:id (GET) :: OK`, () => {
      return request(app.getHttpServer())
        .get(`/contents/${contentMock.id}`)
        .expect(HttpStatus.OK, JSON.stringify(contentResponse))
    })

    it('/contents (POST) :: CREATED', () => {
      return request(app.getHttpServer())
        .post('/contents')
        .send({
          ...createContentMock,
          body: [createContentBodyMock],
        })
        .expect(HttpStatus.CREATED, JSON.stringify(contentResponse))
    })

    it(`/contents/:id (PATCH) :: OK`, () => {
      const newTitle = faker.lorem.sentence(3)
      return request(app.getHttpServer())
        .patch(`/contents/${contentMock.id}`)
        .send({ title: newTitle, body: [createContentBodyMock] })
        .expect(
          HttpStatus.OK,
          new ResponseBuilder()
            .content(contentMock.id)
            .updated({ title: newTitle, body: [createContentBodyMock] })
        )
    })

    it(`/contents/:id (DELETE) :: OK`, () => {
      return request(app.getHttpServer())
        .delete(`/contents/${contentMock.id}`)
        .expect(
          HttpStatus.OK,
          new ResponseBuilder().content(contentMock.id).deleted()
        )
    })
  })

  describe('ContentsModule (e2e) bad request path', () => {
    beforeEach(async () => {
      app = await buildApp([])
      await app.init()
    })

    it(`/contents/:id (GET) :: BAD_REQUEST - content invalid uuid`, () => {
      return request(app.getHttpServer())
        .get(`/contents/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/contents (POST) :: BAD_REQUEST - content invalid field`, () => {
      return request(app.getHttpServer())
        .post('/contents')
        .send({ ...contentMock, channel_id: faker.lorem.word() })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('channel_id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/contents/:id (PATCH) :: BAD_REQUEST - content non uuid`, () => {
      return request(app.getHttpServer())
        .patch(`/contents/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/contents/:id (PATCH) :: BAD_REQUEST - content invalid field`, () => {
      return request(app.getHttpServer())
        .patch(`/contents/${contentMock.id}`)
        .send({ description: [faker.lorem.word()] })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('description', 'a string')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/contents/:id (DELETE) :: BAD_REQUEST - content invalid uuid`, () => {
      return request(app.getHttpServer())
        .delete(`/contents/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })
  })

  describe('ContentsModule (e2e) not found path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryNotFound(),
          entity: Content,
        },
      ])
      await app.init()
    })

    it(`/contents/:id (GET) :: NOT_FOUND - content not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .get(`/contents/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .content(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/contents/:id (PATCH) :: NOT_FOUND - content not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/contents/${id}`)
        .send({ name: faker.person.fullName() })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .content(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/contents/:id (DELETE) :: NOT_FOUND - content not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .delete(`/contents/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .content(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })
  })

  describe('ContentsModule (e2e) conflict path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryConflict(contentMock),
          entity: Content,
        },
      ])
      await app.init()
    })

    it(`/contents (POST) :: CONFLICT - content already exists`, () => {
      return request(app.getHttpServer())
        .post('/contents')
        .send({
          ...contentMock,
          channel_id: channelMock.id,
        })
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .content()
            .conflict('title')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/contents/:id (PATCH) :: CONFLICT - content already exists`, () => {
      return request(app.getHttpServer())
        .patch(`/contents/${contentMock.id}`)
        .send({ title: contentMock.title })
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .content()
            .conflict('title')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/contents/:id (DELETE) :: CONFLICT - content has dependencies`, () => {
      return request(app.getHttpServer())
        .delete(`/contents/${contentMock.id}`)
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .content(contentMock.id)
            .conflict()
            .errorCode(HttpStatus.CONFLICT)
        )
    })
  })

  describe('ContentsModule (e2e) fk not found path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryFKNotFound(contentMock),
          entity: Content,
        },
      ])
      await app.init()
    })

    it(`/contents (POST) :: NOT_FOUND - content has invalid fk`, () => {
      const channel_id = faker.string.uuid()
      return request(app.getHttpServer())
        .post('/contents')
        .send({ ...contentMock, channel_id })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .content()
            .fkNotFound('Channel', channel_id)
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/contents/:id (PATCH) :: NOT_FOUND - content has invalid fk`, () => {
      const channel_id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/contents/${contentMock.id}`)
        .send({
          title: faker.lorem.sentence(3),
          channel_id,
        })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .content()
            .fkNotFound('Channel', channel_id)
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })
  })

  describe('ContentsModule (e2e) ISE path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryServerError(),
          entity: Content,
        },
      ])
      await app.init()
    })

    it('/contents (GET) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .get('/contents')
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/contents/:id (GET) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .get(`/contents/${contentMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it('/contents (POST) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .post('/contents')
        .send({
          ...contentMock,
          channel_id: channelMock.id,
        })
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/contents/:id (PATCH) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .patch(`/contents/${contentMock.id}`)
        .send({ title: faker.lorem.sentence(3) })
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/contents/:id (DELETE) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .delete(`/contents/${contentMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })
  })
})
