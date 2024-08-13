import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { TickerCollectorController } from './ticker-collector.controller';
import { TickerCollectorService } from './ticker-collector.service';

@Module({
  controllers: [TickerCollectorController],
  exports: [TickerCollectorService],
  imports: [ConfigModule, HttpModule],
  providers: [TickerCollectorService],
})
export class TickerControllerModule {}
