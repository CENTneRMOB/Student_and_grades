import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { NatsService } from './nats/nats.service';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private nats: NatsService,
  ) {}

  async getLogs(
    start: number,
    limit: number,
  ): Promise<object> {
    const grades =
      await this.prisma.grade.findMany({
        orderBy: { createdAt: 'asc' },
        skip: start,
        take: limit,
      });

    const logs = await Promise.all(
      grades.map(async (item) => {
        const { createdAt, grade, subject } =
          item;

        const studentInfo =
          await this.nats.sendRequest(
            'students.v1.get',
            item.personalCode,
          );

        const { personalCode, name, lastName } =
          JSON.parse(studentInfo).data;

        return {
          date: new Date(createdAt).toISOString(),
          subject,
          grade,
          student: {
            personalCode,
            name,
            lastName,
          },
        };
      }),
    );

    return logs;
  }

  async getStatistic(
    code: string,
  ): Promise<object> {
    const uniqSubjects =
      await this.prisma.grade.findMany({
        select: { subject: true },
        distinct: ['subject'],
      });

    const StringifiedStudentInfo =
      await this.nats.sendRequest(
        'students.v1.get',
        code,
      );

    const { personalCode, name, lastName } =
      JSON.parse(StringifiedStudentInfo).data;

    const statistic = await Promise.all(
      uniqSubjects.map(async (item) => {
        const subjectInfo = await this.prisma
          .$queryRaw`SELECT count(id) as "totalGrades", min(grade) as "minGrade", max(grade) as "maxGrade", avg(grade::float) as "avgGrade" FROM "Grade" WHERE "personalCode" = ${code} AND "subject" = ${item.subject};`;

        const {
          totalGrades,
          minGrade,
          maxGrade,
          avgGrade,
        } = subjectInfo[0];

        return {
          subject: item.subject,
          maxGrade,
          minGrade,
          avgGrade,
          totalGrades: Number(totalGrades),
        };
      }),
    );

    return {
      student: {
        personalCode,
        name,
        lastName,
      },
      statistic,
    };
  }
}
