import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { AppModule } from '#app/app.module'
import { mainConfig } from '#app/main.config'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'

export const buildApp = async (
  mockRepository: object,
  entity: EntityClassOrSchema
): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(getRepositoryToken(entity))
    .useValue(mockRepository)
    .compile()

  const appInstance = moduleFixture.createNestApplication()
  mainConfig(appInstance)
  return appInstance
}
