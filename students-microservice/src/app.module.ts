import { Module } from '@nestjs/common';
import { StudentsModule } from './students_and_grades/students_and_grades.module';
import { StudentsService } from './students_and_grades/students_and_grades.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { NatsExternalClientModule } from './nats-client/nats-client.module';
import { NatsRequestModule } from './nats/nats.module';

@Module({
  imports: [
    StudentsModule,
    NatsExternalClientModule,
    NatsRequestModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [StudentsService],
})
export class AppModule {}
