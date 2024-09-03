import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SourceStocksApiService } from './source-stocks-api.service';
import { SourceStocksApiController } from './source-stocks-api.controller';

@Module({
  exports: [SourceStocksApiService],
  imports: [ConfigModule, HttpModule],
  providers: [SourceStocksApiService],
  controllers: [SourceStocksApiController],
})
export class SourceStocksApiModule {}
