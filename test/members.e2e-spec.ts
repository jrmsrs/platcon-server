import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { faker } from '@faker-js/faker'

import { buildApp } from '#utils/test/e2e'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { Member } from '#members/entities/member.entity'
import { memberMock } from '#members/__mocks__'
import {
  mockOrmRepository,
  mockOrmRepositoryServerError,
  mockOrmRepositoryConflict,
  mockOrmRepositoryFKNotFound,
  mockOrmRepositoryNotFound,
} from './__mocks__'

describe('MembersModule (e2e)', () => {
  let app: INestApplication

  describe('MembersModule (e2e) happy path', () => {
    beforeEach(async () => {
      app = await buildApp(mockOrmRepository(memberMock), Member)
      await app.init()
    })

    it('/members (GET) :: OK', () => {
      return request(app.getHttpServer())
        .get('/members')
        .expect(HttpStatus.OK, [memberMock])
    })

    it(`/members/:id (GET) :: OK`, () => {
      return request(app.getHttpServer())
        .get(`/members/${memberMock.id}`)
        .expect(HttpStatus.OK, memberMock)
    })

    it('/members (POST) :: CREATED', () => {
      return request(app.getHttpServer())
        .post('/members')
        .send(memberMock)
        .expect(HttpStatus.CREATED, memberMock)
    })

    it(`/members/:id (PATCH) :: OK`, () => {
      const newName = faker.person.fullName()
      return request(app.getHttpServer())
        .patch(`/members/${memberMock.id}`)
        .send({ name: newName })
        .expect(
          HttpStatus.OK,
          new ResponseBuilder().member(memberMock.id).updated({ name: newName })
        )
    })

    it(`/members/:id (DELETE) :: OK`, () => {
      return request(app.getHttpServer())
        .delete(`/members/${memberMock.id}`)
        .expect(
          HttpStatus.OK,
          new ResponseBuilder().member(memberMock.id).deleted()
        )
    })
  })

  describe('MembersModule (e2e) bad request path', () => {
    beforeEach(async () => {
      app = await buildApp(mockOrmRepository(memberMock), Member)
      await app.init()
    })

    it(`/members/:id (GET) :: BAD_REQUEST - member invalid uuid`, () => {
      return request(app.getHttpServer())
        .get(`/members/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/members (POST) :: BAD_REQUEST - member invalid field`, () => {
      return request(app.getHttpServer())
        .post('/members')
        .send({ ...memberMock, website: [faker.number.int()] })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .each()
            .mustBe('website', 'a URL address')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/members/:id (PATCH) :: BAD_REQUEST - member non uuid`, () => {
      return request(app.getHttpServer())
        .patch(`/members/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/members/:id (PATCH) :: BAD_REQUEST - member invalid field`, () => {
      return request(app.getHttpServer())
        .patch(`/members/${memberMock.id}`)
        .send({ website: [faker.number.int] })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .each()
            .mustBe('website', 'a URL address')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/members/:id (DELETE) :: BAD_REQUEST - member invalid uuid`, () => {
      return request(app.getHttpServer())
        .delete(`/members/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })
  })

  describe('MembersModule (e2e) not found path', () => {
    beforeEach(async () => {
      app = await buildApp(mockOrmRepositoryNotFound(), Member)
      await app.init()
    })

    it(`/members/:id (GET) :: NOT_FOUND - member not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .get(`/members/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .member(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/members/:id (PATCH) :: NOT_FOUND - member not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/members/${id}`)
        .send({ name: faker.person.fullName() })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .member(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/members/:id (DELETE) :: NOT_FOUND - member not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .delete(`/members/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .member(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })
  })

  describe('MembersModule (e2e) conflict path', () => {
    beforeEach(async () => {
      app = await buildApp(mockOrmRepositoryConflict(), Member)
      await app.init()
    })

    it(`/members (POST) :: CONFLICT - member already exists`, () => {
      return request(app.getHttpServer())
        .post('/members')
        .send(memberMock)
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .member()
            .conflict('stage_name')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/members/:id (PATCH) :: CONFLICT - member already exists`, () => {
      return request(app.getHttpServer())
        .patch(`/members/${memberMock.id}`)
        .send({ stage_name: memberMock.stage_name })
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .member()
            .conflict('stage_name')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/members/:id (DELETE) :: CONFLICT - member has dependencies`, () => {
      return request(app.getHttpServer())
        .delete(`/members/${memberMock.id}`)
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .member(memberMock.id)
            .conflict()
            .errorCode(HttpStatus.CONFLICT)
        )
    })
  })

  describe('MembersModule (e2e) fk not found path', () => {
    beforeEach(async () => {
      app = await buildApp(mockOrmRepositoryFKNotFound(), Member)
      await app.init()
    })

    it(`/members (POST) :: NOT_FOUND - member has invalid fk`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .post('/members')
        .send({ ...memberMock, user_id: id })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .member()
            .fkNotFound('User', id)
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/members/:id (PATCH) :: NOT_FOUND - member has invalid fk`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/members/${memberMock.id}`)
        .send({ user_id: id })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .member()
            .fkNotFound('User', id)
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })
  })

  describe('MembersModule (e2e) ISE path', () => {
    beforeEach(async () => {
      app = await buildApp(mockOrmRepositoryServerError(), Member)
      await app.init()
    })

    it('/members (GET) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .get('/members')
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/members/:id (GET) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .get(`/members/${memberMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it('/members (POST) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .post('/members')
        .send(memberMock)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/members/:id (PATCH) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .patch(`/members/${memberMock.id}`)
        .send({ name: faker.person.fullName() })
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/members/:id (DELETE) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .delete(`/members/${memberMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })
  })
})
