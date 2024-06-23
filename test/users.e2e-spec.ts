import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { getRepositoryToken } from '@nestjs/typeorm'
import { faker } from '@faker-js/faker'

import { mainConfig } from '#app/main.config'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { AppModule } from '#app/app.module'
import { User } from '#users/entities/user.entity'

import { userMock } from '#users/__mocks__/user.mock'
import { mockOrmRepository, mockOrmRepositoryNotFound } from '#test/__mocks__/orm-repository.mock'

describe('UsersModule (e2e)', () => {
  let app: INestApplication

  describe('UsersModule (e2e) happy path', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(getRepositoryToken(User))
        .useValue(mockOrmRepository(userMock))
        .compile()

      app = moduleFixture.createNestApplication()
      mainConfig(app)
      await app.init()
    })

    it('/users (GET)', () => {
      return request(app.getHttpServer()).get('/users').expect(200).expect([userMock])
    })

    it(`/users/:id (GET)`, () => {
      return request(app.getHttpServer()).get(`/users/${userMock.id}`).expect(200).expect(userMock)
    })

    it('/users (POST)', () => {
      return request(app.getHttpServer()).post('/users').send(userMock).expect(201).expect(userMock)
    })

    it(`/users/:id (PATCH)`, () => {
      const newName = faker.person.fullName()
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ name: newName })
        .expect(200)
        .expect(new ResponseBuilder().user(userMock.id).updated({ name: newName }))
    })

    it(`/users/:id (DELETE)`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${userMock.id}`)
        .expect(200)
        .expect(new ResponseBuilder().user(userMock.id).deleted())
    })
  })

  describe('UsersModule (e2e) error path', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(getRepositoryToken(User))
        .useValue(mockOrmRepositoryNotFound())
        .compile()

      app = moduleFixture.createNestApplication()
      mainConfig(app)
      await app.init()
    })

    it(`/users/:id (GET) :: invalid uuid`, () => {
      return request(app.getHttpServer())
        .get(`/users/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/:id (GET) :: not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().user(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })

    it(`/users (POST) :: invalid field`, () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ ...userMock, email: faker.lorem.word() })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('email', 'an email').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/:id (PATCH) :: non uuid`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/:id (PATCH) :: invalid field`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ email: 'invalid-email' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('email', 'an email').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/:id (PATCH) :: not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({ name: faker.person.fullName() })
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().user(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })

    it(`/users/:id (DELETE) :: invalid uuid`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/:id (DELETE) :: not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .delete(`/users/${id}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().user(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })
  })
})
