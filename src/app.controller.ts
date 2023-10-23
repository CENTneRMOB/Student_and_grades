import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('log?')
  getLogs(
    @Query('start', ParseIntPipe) start: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.appService.getLogs(start, limit);
  }

  @Get('statistic/:code')
  getStatistic(@Param('code') code: string) {
    return this.appService.getStatistic(code);
  }
}
