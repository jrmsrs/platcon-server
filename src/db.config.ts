import { ConfigService } from '@nestjs/config'

import { TypeOrmModuleOptions } from '@nestjs/typeorm'

import { User } from '#users/entities/user.entity'
import { Member } from '#members/entities/member.entity'
import { Channel } from '#channels/entities/channel.entity'

export class DbConfig {
  static createConnection(configService: ConfigService): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [User, Member, Channel],
      synchronize: false,
      logging: true,
    }
  }
}
