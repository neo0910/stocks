import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TickerModule } from '../ticker/ticker.module';

import { DailyPrice } from './daily-price.model';
import { DailyPriceController } from './daily-price.controller';
import { DailyPriceService } from './daily-price.service';

@Module({
  controllers: [DailyPriceController],
  imports: [TypeOrmModule.forFeature([DailyPrice]), TickerModule],
  providers: [DailyPriceService],
})
export class DailyPriceModule {}
