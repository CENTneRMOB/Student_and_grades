import { Global, Module } from '@nestjs/common';
import { NatsRequestService } from './nats.service';

@Global()
@Module({
  providers: [NatsRequestService],
  exports: [NatsRequestService],
})
export class NatsRequestModule {}
