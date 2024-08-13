import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { StockApiModule } from './stock-api/stock-api.module';
import { TickerControllerModule } from './ticker-collector/ticker-collector.module';

@Module({
  imports: [ConfigModule.forRoot(), StockApiModule, TickerControllerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
