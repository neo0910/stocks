import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { getKafkaTransportConfig } from './shared/configs/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  await app
    .connectMicroservice<MicroserviceOptions>(
      getKafkaTransportConfig(configService),
    )
    .listen();
}

bootstrap();
