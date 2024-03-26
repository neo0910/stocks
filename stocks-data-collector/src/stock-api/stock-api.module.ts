import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { StockApiService } from './stock-api.service';
import { StockApiController } from './stock-api.controller';

@Module({
  exports: [StockApiService],
  imports: [ConfigModule, HttpModule],
  providers: [StockApiService],
  controllers: [StockApiController],
})
export class StockApiModule {}
