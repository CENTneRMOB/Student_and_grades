import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { StudentsGradedDto } from './dtos';
import { NatsRequestService } from 'src/nats/nats.service';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private natsRequest: NatsRequestService,
  ) {}

  async getLogs(
    start: number,
    limit: number,
  ): Promise<object> {
    try {
      const grades =
        await this.prisma.grade.findMany({
          include: {
            student: true,
          },
          orderBy: { createdAt: 'asc' },
          skip: start,
          take: limit,
        });

      return grades.map((item) => {
        const {
          createdAt,
          grade,
          subject,
          student: {
            name,
            lastName,
            personalCode,
          },
        } = item;

        return {
          date: createdAt.toISOString(),
          subject,
          grade,
          student: {
            personalCode,
            name,
            lastName,
          },
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getStatistic(
    personalCode: string,
  ): Promise<object> {
    try {
      const uniqSubjects =
        await this.prisma.grade.findMany({
          select: { subject: true },
          distinct: ['subject'],
        });

      const student =
        await this.prisma.student.findUnique({
          where: { personalCode },
        });

      if (!student) {
        console.log('Student not found');
        return;
      }

      const studentStatistics =
        await this.prisma.grade.groupBy({
          by: ['subject'],
          where: { student: { personalCode } },
          _max: { grade: true },
          _min: { grade: true },
          _avg: { grade: true },
          _count: true,
        });

      const formattedStudentStatistics =
        studentStatistics.reduce((acc, item) => {
          acc[item.subject] = {
            subject: item.subject,
            maxGrade: item._max.grade,
            minGrade: item._min.grade,
            avgGrade: Number(
              item._avg.grade.toFixed(1),
            ),
            totalGrades: item._count,
          };
          return acc;
        }, {});

      const formattedStatistics = {
        student: {},
        statistic: [],
      };

      if (!studentStatistics.length) {
        console.log('Student not found');
        return;
      }

      formattedStatistics.student = {
        personalCode: student.personalCode,
        name: student.name,
        lastName: student.lastName,
      };

      const studentSubjects =
        studentStatistics.map(
          (item) => item.subject,
        );

      for (const { subject } of uniqSubjects) {
        if (studentSubjects.includes(subject)) {
          formattedStatistics.statistic.push(
            formattedStudentStatistics[subject],
          );
        } else {
          formattedStatistics.statistic.push({
            subject,
            maxGrade: 0,
            minGrade: 0,
            avgGrade: 0,
            totalGrades: 0,
          });
        }
      }

      return formattedStatistics;
    } catch (error) {
      console.error(error);
    }
  }

  async getStudentFullInfo(personalCode: string) {
    try {
      const fullInfo =
        await this.natsRequest.sendRequest(
          'students.v1.get',
          personalCode,
        );

      const answer = JSON.parse(fullInfo);

      if ('error' in answer) {
        throw new Error(fullInfo.error.message);
      }

      return answer.data;
    } catch (err) {
      console.error(err);
      this.natsRequest.onModuleDestroy();
    }
  }

  async gradeStudent(
    studentsInfoDto: StudentsGradedDto,
  ) {
    try {
      const { personalCode, grade, subject } =
        studentsInfoDto;
      const { name, lastName } =
        await this.getStudentFullInfo(
          personalCode,
        );

      let student =
        await this.prisma.student.findUnique({
          where: { personalCode },
        });

      if (!student) {
        student =
          await this.prisma.student.create({
            data: {
              name,
              lastName,
              personalCode,
            },
          });
      }

      await this.prisma.grade.create({
        data: {
          grade,
          subject,
          student: {
            connect: { id: student.id },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
