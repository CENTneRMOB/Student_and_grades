import { Controller } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { StudentsGradedDto } from './dtos';
import { StudentsService } from './students_and_grades.service';

@Controller()
export class StudentsMicroserviceController {
  constructor(
    private studentsService: StudentsService,
  ) {}

  @MessagePattern({
    cmd: 'getLog',
  })
  getLog(
    @Payload()
    data: {
      start: number;
      limit: number;
    },
  ) {
    return this.studentsService.getLogs(
      data.start,
      data.limit,
    );
  }

  @MessagePattern({ cmd: 'getStatistic' })
  async getStatistic(
    @Payload() data: { code: string },
  ) {
    return await this.studentsService.getStatistic(
      data.code,
    );
  }

  @EventPattern('students.v1.graded')
  async studentsSubscribe(
    @Payload()
    studentsGradedDto: StudentsGradedDto,
  ) {
    return this.studentsService.gradeStudent(
      studentsGradedDto,
    );
  }
}
