import { NestFactory } from '@nestjs/core'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { mainConfig } from '#app/main.config'
import { AppModule } from '#app/app.module'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Platcon')
  .setDescription(
    `\
A description`
  )
  .setVersion('0.0.1')
  .addTag('Users', 'Rotas Usuários')
  .addTag('Members', 'Rotas Membros')
  .build()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  mainConfig(app)
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)
  await app.listen(3000)
}
bootstrap()
