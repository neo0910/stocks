import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyPrice } from '@stocks/models';

import { getKafkaClientConfig } from '../shared/configs/kafka-client.config';
import { TickerModule } from '../ticker/ticker.module';

import { DailyPriceController } from './daily-price.controller';
import { DailyPriceService } from './daily-price.service';

@Module({
  controllers: [DailyPriceController],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'DAILY_PRICE_COLLECTOR_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getKafkaClientConfig('price-daily'),
      },
    ]),
    TickerModule,
    TypeOrmModule.forFeature([DailyPrice]),
  ],
  providers: [DailyPriceService],
})
export class DailyPriceModule {}
