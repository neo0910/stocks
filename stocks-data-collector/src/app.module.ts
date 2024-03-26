import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { StockApiModule } from './stock-api/stock-api.module';

@Module({
  imports: [ConfigModule.forRoot(), StockApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
