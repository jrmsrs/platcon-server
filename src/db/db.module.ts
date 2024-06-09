import { Module } from '@nestjs/common'
import { DbConnection } from './db.service'

@Module({
  providers: [DbConnection],
  exports: [DbConnection],
})
export class DbModule {}
