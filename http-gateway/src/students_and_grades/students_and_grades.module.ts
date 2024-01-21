import { Module } from '@nestjs/common';
import { StudentsController } from './students_and_grades.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [StudentsController],
  providers: [],
})
export class StudentsModule {}
