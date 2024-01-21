import { Module } from '@nestjs/common';
import { StudentsMicroserviceController } from './students_and_grades.controller';
import { NatsExternalClientModule } from 'src/nats-client/nats-client.module';
import { StudentsService } from './students_and_grades.service';
import { NatsRequestModule } from 'src/nats/nats.module';

@Module({
  imports: [
    NatsExternalClientModule,
    NatsRequestModule,
  ],
  controllers: [StudentsMicroserviceController],
  providers: [StudentsService],
})
export class StudentsModule {}
