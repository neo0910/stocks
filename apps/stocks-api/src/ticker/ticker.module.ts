import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getKafkaClientConfig } from '../shared/configs/kafka-client.config';

import { Ticker } from './ticker.model';
import { TickerController } from './ticker.controller';
import { TickerService } from './ticker.service';

@Module({
  controllers: [TickerController],
  exports: [TickerService],
  imports: [
    TypeOrmModule.forFeature([Ticker]),
    ClientsModule.registerAsync([
      {
        name: 'STOCKS_DATA_COLLECTOR_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getKafkaClientConfig,
      },
    ]),
  ],
  providers: [TickerService],
})
export class TickerModule {}
