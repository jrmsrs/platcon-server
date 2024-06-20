import { ConfigService } from '@nestjs/config'
import { User } from './users/entities/user.entity'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export class DbConfig {
  static createConnection(configService: ConfigService): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [User],
      synchronize: false,
      logging: true,
    }
  }
}
