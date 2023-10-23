import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  connect,
  NatsConnection,
  Subscription,
  StringCodec,
} from 'nats';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NatsService
  implements OnModuleDestroy
{
  constructor(private prisma: PrismaService) {}
  private natsConnection: NatsConnection;
  private subscription: Subscription;
  private sc = StringCodec();

  async connect() {
    this.natsConnection = await connect({
      servers: `nats://192.162.246.63:4222`,
    });

    this.subscription =
      this.natsConnection.subscribe(
        'students.v1.graded',
      );

    try {
      for await (const message of this
        .subscription) {
        const {
          data: { personalCode, grade, subject },
        } = JSON.parse(
          StringCodec().decode(message.data),
        );

        await this.prisma.grade.create({
          data: {
            personalCode,
            grade,
            subject,
          },
        });
      }
    } catch (err) {
      console.error(
        'Error in NATS subscription:',
        err,
      );
    }
  }

  onModuleDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.natsConnection) {
      this.natsConnection.close();
    }
  }

  async sendRequest(
    subject: string,
    data: any,
  ): Promise<any> {
    const response =
      await this.natsConnection.request(
        subject,
        JSON.stringify({
          personalCode: data,
        }),
      );

    return this.sc.decode(response.data);
  }
}
