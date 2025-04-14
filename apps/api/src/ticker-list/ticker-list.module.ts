import { Module } from '@nestjs/common';
import { TickerListController } from './ticker-list.controller';

@Module({
  controllers: [TickerListController],
})
export class TickerListModule {}
