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

@Injectable()
export class NatsRequestService
  implements OnModuleDestroy
{
  constructor() {}
  private natsConnection: NatsConnection;
  private subscription: Subscription;
  private sc = StringCodec();

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
    this.natsConnection = await connect({
      servers: `nats://192.162.246.63:4222`,
    });
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
