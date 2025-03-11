import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduledTicker } from '@app/stocks-models';

import { OneHourPriceCollectorModule } from '../one-hour-price-collector/one-hour-price-collector.module';
import { ScheduledTickerCollectorService } from './scheduled-ticker-collector.service';
import { SourceStocksApiModule } from '../source-stocks-api/source-stocks-api.module';

@Module({
  exports: [ScheduledTickerCollectorService],
  imports: [
    TypeOrmModule.forFeature([ScheduledTicker]),
    forwardRef(() => OneHourPriceCollectorModule),
    SourceStocksApiModule,
  ],
  providers: [ScheduledTickerCollectorService],
})
export class ScheduledTickerCollectorModule {}
