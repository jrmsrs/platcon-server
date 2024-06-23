import { Controller, Get } from '@nestjs/common'

import { ApiExcludeController } from '@nestjs/swagger'

import { AppService } from '#app/app.service'

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): { message: string } {
    return this.appService.getRoot()
  }
}
