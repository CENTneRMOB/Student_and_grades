import { Module } from '@nestjs/common';
import {
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_EXTERNAL_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://192.162.246.63:4222'],
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: 'NATS_EXTERNAL_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://192.162.246.63:4222'],
        },
      },
    ]),
  ],
  providers: [],
})
export class NatsExternalClientModule {}
