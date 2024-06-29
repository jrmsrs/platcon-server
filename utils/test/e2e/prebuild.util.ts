import { INestApplication } from '@nestjs/common'
import { Test, TestingModuleBuilder } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { AppModule } from '#app/app.module'
import { mainConfig } from '#app/main.config'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'

export const buildApp = async (
  mockRepository: {
    repository: object
    entity: EntityClassOrSchema
  }[]
): Promise<INestApplication> => {
  const moduleFixture: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  })

  mockRepository.forEach(({ entity, repository }) => {
    moduleFixture
      .overrideProvider(getRepositoryToken(entity))
      .useValue(repository)
  })

  const appInstance = (await moduleFixture.compile()).createNestApplication()
  mainConfig(appInstance)
  return appInstance
}
