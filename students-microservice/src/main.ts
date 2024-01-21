import { NestFactory } from '@nestjs/core';
import {
  Transport,
  MicroserviceOptions,
} from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const innerService =
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats'],
      },
    });
  const externalService =
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: ['nats://192.162.246.63:4222'],
      },
    });

  await app.startAllMicroservices();

  await app.listen(8080);
}
bootstrap();
