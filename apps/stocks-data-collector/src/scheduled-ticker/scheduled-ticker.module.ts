import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduledTicker } from '@app/stocks-models';

import { ScheduledTickerService } from './scheduled-ticker.service';

@Module({
  exports: [ScheduledTickerService],
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([ScheduledTicker]),
  ],
  providers: [ScheduledTickerService],
})
export class ScheduledTickerModule {}
