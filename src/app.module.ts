import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { TypeOrmModule } from '@nestjs/typeorm'

import { DbConfig } from '#app/db.config'
import { AppController } from '#app/app.controller'
import { AppService } from '#app/app.service'

import { UsersModule } from '#users/users.module'
import { MembersModule } from '#members/members.module'
import { ChannelsModule } from '#channels/channels.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        DbConfig.createConnection(configService),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    MembersModule,
    ChannelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
