import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const getKafkaTransportConfig = (
  configService: ConfigService,
): KafkaOptions => {
  const brokerURL = `${configService.get('KAFKA_HOST')}:${configService.get('KAFKA_PORT')}`;
  const groupId = configService.get('KAFKA_CONSUMER_GROUP_ID');

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [brokerURL],
      },
      consumer: { groupId },
    },
  };
};
