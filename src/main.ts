import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NatsService } from './nats/nats.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8080);
  const natsService = app.get(NatsService);

  try {
    await natsService.connect();
  } catch (err) {
    console.error(err);
    natsService.onModuleDestroy();
  }
}
bootstrap();
