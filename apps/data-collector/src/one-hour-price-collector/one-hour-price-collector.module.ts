import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OneHourPrice } from '@stocks/models';

import { ScheduledTickerCollectorModule } from '../scheduled-ticker-collector/scheduled-ticker-collector.module';
import { TickerCollectorModule } from '../ticker-collector/ticker-collector.module';

import { OneHourPriceCollectorController } from './one-hour-price-collector.controller';
import { OneHourPriceCollectorService } from './one-hour-price-collector.service';
import { SourceStocksApiModule } from '../source-stocks-api/source-stocks-api.module';

@Module({
  controllers: [OneHourPriceCollectorController],
  exports: [OneHourPriceCollectorService],
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([OneHourPrice]),
    ScheduledTickerCollectorModule,
    SourceStocksApiModule,
    TickerCollectorModule,
  ],
  providers: [OneHourPriceCollectorService],
})
export class OneHourPriceCollectorModule {}
