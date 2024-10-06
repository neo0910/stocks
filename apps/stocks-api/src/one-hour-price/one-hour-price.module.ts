import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OneHourPrice } from '@app/stocks-models';

import { getKafkaClientConfig } from '../shared/configs/kafka-client.config';
import { TickerModule } from '../ticker/ticker.module';

import { OneHourPriceController } from './one-hour-price.controller';
import { OneHourPriceService } from './one-hour-price.service';

@Module({
  controllers: [OneHourPriceController],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ONE_HOUR_PRICE_COLLECTOR_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getKafkaClientConfig('price-one-hour'),
      },
    ]),
    TickerModule,
    TypeOrmModule.forFeature([OneHourPrice]),
  ],
  providers: [OneHourPriceService],
})
export class OneHourPriceModule {}
