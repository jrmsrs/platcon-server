import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { userMock } from '../src/users/__mocks__/user.mock'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../src/users/entities/user.entity'
import { AppModule } from '../src/app.module'
import { faker } from '@faker-js/faker'
import { mainConfig } from '../src/main.config'
import { ResponseBuilder } from '../utils/resBuilder.util'
import { mockRepository, mockRepositoryNotFound } from './__mocks__/usersRepository.mock'

describe('UsersModule (e2e)', () => {
  let app: INestApplication

  describe('UsersModule (e2e) / Happy path', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(getRepositoryToken(User))
        .useValue(mockRepository())
        .compile()

      app = moduleFixture.createNestApplication()
      mainConfig(app)
      await app.init()
    })

    it('/users (GET)', () => {
      return request(app.getHttpServer()).get('/users').expect(200).expect([userMock])
    })

    it(`/users/${userMock.id} (GET)`, () => {
      return request(app.getHttpServer()).get(`/users/${userMock.id}`).expect(200).expect(userMock)
    })

    it('/users (POST)', () => {
      return request(app.getHttpServer()).post('/users').send(userMock).expect(201).expect(userMock)
    })

    it(`/users/${userMock.id} (PATCH)`, () => {
      const newName = faker.person.fullName()
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ name: newName })
        .expect(200)
        .expect(new ResponseBuilder().user(userMock.id).updated({ name: newName }).message)
    })

    it(`/users/${userMock.id} (DELETE)`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${userMock.id}`)
        .expect(200)
        .expect(new ResponseBuilder().user(userMock.id).deleted().message)
    })
  })

  describe('UsersModule (e2e) / Error path', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(getRepositoryToken(User))
        .useValue(mockRepositoryNotFound())
        .compile()

      app = moduleFixture.createNestApplication()
      mainConfig(app)
      await app.init()
    })

    it(`/users/${userMock.id} (GET) / non uuid`, () => {
      return request(app.getHttpServer())
        .get(`/users/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/${userMock.id} (GET) / not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().user(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })

    it(`/users (POST) / invalid email`, () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ ...userMock, email: faker.lorem.word() })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('email', 'an email').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/${userMock.id} (PATCH) / non uuid`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/${userMock.id} (PATCH) / invalid email`, () => {
      return request(app.getHttpServer())
        .patch(`/users/${userMock.id}`)
        .send({ email: 'invalid-email' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('email', 'an email').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/${userMock.id} (PATCH) / not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/users/${id}`)
        .send({ name: faker.person.fullName() })
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().user(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })

    it(`/users/${userMock.id} (DELETE) / non uuid`, () => {
      return request(app.getHttpServer())
        .delete(`/users/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/users/${userMock.id} (DELETE) / not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .delete(`/users/${id}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().user(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })
  })
})
