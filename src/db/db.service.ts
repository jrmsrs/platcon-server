import { ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'

export const DbConnection = {
  provide: 'DataSource',
  useFactory: async (configService: ConfigService) => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [
        /* UsersEntity */
      ],
      synchronize: true,
      logging: true,
    })

    return await dataSource.initialize()
  },
  // allows useFactory to access the configuration service.
  inject: [ConfigService],
}
