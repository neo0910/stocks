import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyPrice } from '@app/stocks-models';

import { getKafkaClientConfig } from '../shared/configs/kafka-client.config';

import { DailyPriceController } from './daily-price.controller';
import { DailyPriceService } from './daily-price.service';

@Module({
  controllers: [DailyPriceController],
  imports: [
    TypeOrmModule.forFeature([DailyPrice]),
    ClientsModule.registerAsync([
      {
        name: 'DAILY_PRICE_COLLECTOR_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getKafkaClientConfig('price-daily'),
      },
    ]),
  ],
  providers: [DailyPriceService],
})
export class DailyPriceModule {}
