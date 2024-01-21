import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class StudentsController {
  constructor(
    @Inject('NATS_SERVICE')
    private natsClient: ClientProxy,
  ) {}

  @Get('log?')
  getLogs(
    @Query('start', ParseIntPipe) start: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.natsClient.send(
      { cmd: 'getLog' },
      { start, limit },
    );
  }

  @Get('statistic/:code')
  getStatistic(@Param('code') code: string) {
    return this.natsClient.send(
      { cmd: 'getStatistic' },
      { code },
    );
  }
}
