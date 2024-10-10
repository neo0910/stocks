import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OneHourPrice } from '@app/stocks-models';

import { TickerCollectorModule } from '../ticker-collector/ticker-collector.module';

import { OneHourPriceCollectorController } from './one-hour-price-collector.controller';
import { OneHourPriceCollectorService } from './one-hour-price-collector.service';

@Module({
  controllers: [OneHourPriceCollectorController],
  exports: [OneHourPriceCollectorService],
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([OneHourPrice]),
    TickerCollectorModule,
  ],
  providers: [OneHourPriceCollectorService],
})
export class OneHourPriceCollectorModule {}
