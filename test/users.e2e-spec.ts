import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { faker } from '@faker-js/faker'

import { buildApp } from '#utils/test/e2e'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { User } from '#users/entities/user.entity'
import { userMock } from '#users/__mocks__'
import {
  mockOrmRepository,
  mockOrmRepositoryServerError,
  mockOrmRepositoryConflict,
  mockOrmRepositoryNotFound,
} from './__mocks__'

describe('UsersModule (e2e)', () => {
  let app: INestApplication

  describe('UsersModule (e2e) happy path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepository(userMock),
          entity: User,
        },
      ])
      await app.init()
    })

    it('/users (GET) :: OK', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK, [userMock])
    })

    it(`/users/:id (GET) :: OK`, () => {
      return request(app.getHttpServer())
        .get(`/users/${userMock.id}`)
        .expect(HttpStatus.OK, userMock)
    })

    it('/users (POST) :: CREATED', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(userMock)
        .expect(HttpStatus.CREATED, userMock)
    })

    it(`/users/:id (PATCH) :: OK`, () => {
      const newName = faker.person.fullName()
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ name: newName })
        .expect(
          HttpStatus.OK,
          new ResponseBuilder().user(userMock.id).updated({ name: newName })
        )
    })

    it(`/users/:id (DELETE) :: OK`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${userMock.id}`)
        .expect(
          HttpStatus.OK,
          new ResponseBuilder().user(userMock.id).deleted()
        )
    })
  })

  describe('UsersModule (e2e) bad request path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepository(userMock),
          entity: User,
        },
      ])
      await app.init()
    })

    it(`/users/:id (GET) :: BAD_REQUEST - user invalid uuid`, () => {
      return request(app.getHttpServer())
        .get(`/users/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/users (POST) :: BAD_REQUEST - user invalid field`, () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ ...userMock, email: faker.lorem.word() })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('email', 'an email')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/users/:id (PATCH) :: BAD_REQUEST - user non uuid`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/users/:id (PATCH) :: BAD_REQUEST - user invalid field`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ email: 'invalid-email' })
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('email', 'an email')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })

    it(`/users/:id (DELETE) :: BAD_REQUEST - user invalid uuid`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${faker.lorem.word()}`)
        .expect(
          HttpStatus.BAD_REQUEST,
          new ResponseBuilder()
            .mustBe('id', 'a UUID')
            .errorCode(HttpStatus.BAD_REQUEST)
        )
    })
  })

  describe('UsersModule (e2e) not found path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryNotFound(),
          entity: User,
        },
      ])
      await app.init()
    })

    it(`/users/:id (GET) :: NOT_FOUND - user not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .user(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/users/:id (PATCH) :: NOT_FOUND - user not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({ name: faker.person.fullName() })
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .user(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })

    it(`/users/:id (DELETE) :: NOT_FOUND - user not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .delete(`/users/${id}`)
        .expect(
          HttpStatus.NOT_FOUND,
          new ResponseBuilder()
            .user(id)
            .notFound()
            .errorCode(HttpStatus.NOT_FOUND)
        )
    })
  })

  describe('UsersModule (e2e) conflict path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryConflict(userMock),
          entity: User,
        },
      ])
      await app.init()
    })

    it(`/users (POST) :: CONFLICT - user already exists`, () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(userMock)
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .user()
            .conflict('email')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/users/:id (PATCH) :: CONFLICT - user already exists`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ email: userMock.email })
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .user()
            .conflict('email')
            .errorCode(HttpStatus.CONFLICT)
        )
    })

    it(`/users/:id (DELETE) :: CONFLICT - user has dependencies`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${userMock.id}`)
        .expect(
          HttpStatus.CONFLICT,
          new ResponseBuilder()
            .user(userMock.id)
            .conflict()
            .errorCode(HttpStatus.CONFLICT)
        )
    })
  })

  describe('UsersModule (e2e) ISE path', () => {
    beforeEach(async () => {
      app = await buildApp([
        {
          repository: mockOrmRepositoryServerError(),
          entity: User,
        },
      ])
      await app.init()
    })

    it('/users (GET) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/users/:id (GET) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .get(`/users/${userMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it('/users (POST) :: ISE - server error', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(userMock)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/users/:id (PATCH) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ name: faker.person.fullName() })
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })

    it(`/users/:id (DELETE) :: ISE - server error`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${userMock.id}`)
        .expect(
          HttpStatus.INTERNAL_SERVER_ERROR,
          new ResponseBuilder()
            .unexpected()
            .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
        )
    })
  })
})
