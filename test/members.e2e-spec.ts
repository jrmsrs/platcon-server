import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { getRepositoryToken } from '@nestjs/typeorm'
import { faker } from '@faker-js/faker'

import { mainConfig } from '#app/main.config'
import { ResponseBuilder } from '#utils/resBuilder.util'
import { AppModule } from '#app/app.module'
import { Member } from '#members/entities/member.entity'

import { memberMock } from '#members/__mocks__/member.mock'
import { mockOrmRepository, mockOrmRepositoryNotFound } from '#test/__mocks__/orm-repository.mock'

describe('MembersModule (e2e)', () => {
  let app: INestApplication

  describe('MembersModule (e2e) happy path', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(getRepositoryToken(Member))
        .useValue(mockOrmRepository(memberMock))
        .compile()

      app = moduleFixture.createNestApplication()
      mainConfig(app)
      await app.init()
    })

    it('/members (GET)', () => {
      return request(app.getHttpServer()).get('/members').expect(200).expect([memberMock])
    })

    it(`/members/:id (GET)`, () => {
      return request(app.getHttpServer()).get(`/members/${memberMock.id}`).expect(200).expect(memberMock)
    })

    it('/members (POST)', () => {
      return request(app.getHttpServer()).post('/members').send(memberMock).expect(201).expect(memberMock)
    })

    it(`/members/:id (PATCH)`, () => {
      const newName = faker.person.fullName()
      return request(app.getHttpServer())
        .patch(`/members/${memberMock.id}`)
        .send({ stage_name: newName })
        .expect(200)
        .expect(new ResponseBuilder().member(memberMock.id).updated({ stage_name: newName }))
    })

    it(`/members/:id (DELETE)`, () => {
      return request(app.getHttpServer())
        .delete(`/members/${memberMock.id}`)
        .expect(200)
        .expect(new ResponseBuilder().member(memberMock.id).deleted())
    })
  })

  describe('MembersModule (e2e) error path', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(getRepositoryToken(Member))
        .useValue(mockOrmRepositoryNotFound())
        .compile()

      app = moduleFixture.createNestApplication()
      mainConfig(app)
      await app.init()
    })

    it(`/members/:id (GET) :: invalid uuid`, () => {
      return request(app.getHttpServer())
        .get(`/members/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/members/:id (GET) :: not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .get(`/members/${id}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().member(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })

    it(`/members (POST) :: invalid field`, () => {
      return request(app.getHttpServer())
        .post('/members')
        .send({ ...memberMock, website: [faker.lorem.word()] })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().each().mustBe('website', 'a URL address').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/members/:id (PATCH) :: non uuid`, () => {
      return request(app.getHttpServer())
        .patch(`/members/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/members/:id (PATCH) :: invalid field`, () => {
      return request(app.getHttpServer())
        .patch(`/members/${memberMock.id}`)
        .send({ website: [faker.lorem.word()] })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().each().mustBe('website', 'a URL address').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/members/:id (PATCH) :: not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .patch(`/members/${id}`)
        .send({ name: faker.person.fullName() })
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().member(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })

    it(`/members/:id (DELETE) :: invalid uuid`, () => {
      return request(app.getHttpServer())
        .delete(`/members/${faker.lorem.word()}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(new ResponseBuilder().mustBe('id', 'a UUID').errorCode(HttpStatus.BAD_REQUEST))
    })

    it(`/members/:id (DELETE) :: not found`, () => {
      const id = faker.string.uuid()
      return request(app.getHttpServer())
        .delete(`/members/${id}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(new ResponseBuilder().member(id).notFound().errorCode(HttpStatus.NOT_FOUND))
    })
  })
})
