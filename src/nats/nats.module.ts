import { Global, Module } from '@nestjs/common';
import { NatsService } from './nats.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Global()
@Module({
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule {}
