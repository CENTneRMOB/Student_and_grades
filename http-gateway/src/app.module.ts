import { Module } from '@nestjs/common';
import { StudentsModule } from './students_and_grades/students_and_grades.module';

@Module({
  imports: [StudentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
