import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist';
import { AppService } from './app.service';

@ApiTags()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ status: 200, type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
