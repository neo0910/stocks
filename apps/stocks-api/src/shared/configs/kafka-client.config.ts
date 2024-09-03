import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const getKafkaClientConfig =
  (groupPostfix: string) =>
  async (configService: ConfigService): Promise<KafkaOptions> => {
    const clientId = configService.get('KAFKA_CLIENT_ID');
    const brokerURL = `${configService.get('KAFKA_HOST')}:${configService.get('KAFKA_PORT')}`;
    const groupId = configService.get('KAFKA_CONSUMER_GROUP_ID');

    return {
      transport: Transport.KAFKA,
      options: {
        client: { clientId, brokers: [brokerURL] },
        consumer: { groupId: `${groupId}:${groupPostfix}` },
      },
    };
  };
