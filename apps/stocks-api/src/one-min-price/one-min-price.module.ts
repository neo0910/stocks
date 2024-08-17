import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OneMinPrice } from '@app/stocks-models';

import { TickerModule } from '../ticker/ticker.module';

import { OneMinPriceController } from './one-min-price.controller';
import { OneMinPriceService } from './one-min-price.service';

@Module({
  controllers: [OneMinPriceController],
  imports: [TypeOrmModule.forFeature([OneMinPrice]), TickerModule],
  providers: [OneMinPriceService],
})
export class OneMinPriceModule {}
