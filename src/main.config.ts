import { INestApplication, ValidationPipe } from '@nestjs/common'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function mainConfig(app: INestApplication) {
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const config = new DocumentBuilder()
    .setTitle('Platcon')
    .setDescription(
      `\
A description`
    )
    .setVersion('0.0.1')
    .addTag('Users', 'Rotas Usuários')
    .addTag('Members', 'Rotas Membros')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
}
