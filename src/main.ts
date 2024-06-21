import { NestFactory } from '@nestjs/core'

import { mainConfig } from '#app/main.config'
import { AppModule } from '#app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  mainConfig(app)
  await app.listen(3000)
}
bootstrap()
