import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyPrice } from '@app/stocks-models';

import { TickerCollectorModule } from '../ticker-collector/ticker-collector.module';

import { DailyPriceCollectorController } from './daily-price-collector.controller';
import { DailyPriceCollectorService } from './daily-price-collector.service';

@Module({
  controllers: [DailyPriceCollectorController],
  exports: [DailyPriceCollectorService],
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([DailyPrice]),
    TickerCollectorModule,
  ],
  providers: [DailyPriceCollectorService],
})
export class DailyPriceCollectorModule {}
