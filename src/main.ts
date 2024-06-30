import { NestFactory } from '@nestjs/core'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { mainConfig } from '#app/main.config'
import { AppModule } from '#app/app.module'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Platcon')
  .setDescription(
    `\
Plataforma de Conteúdos (Platcon) é um agregador de`
  )
  .setVersion('0.0.1')
  .addTag('Users', 'Rotas Usuários')
  .addTag('Members', 'Rotas Membros')
  .addTag('Channels', 'Rotas Canais')
  .build()

swaggerConfig.components.schemas = {
  ...{ SuccessMessage: {}, ErrorMessage: {} },
  ...swaggerConfig.components.schemas,
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  mainConfig(app)
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)
  await app.listen(3000)
}
bootstrap()
