import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduledTicker } from '@app/stocks-models';

import { ScheduledTickerService } from './scheduled-ticker.service';

@Module({
  exports: [ScheduledTickerService],
  imports: [TypeOrmModule.forFeature([ScheduledTicker])],
  providers: [ScheduledTickerService],
})
export class ScheduledTickerModule {}
