import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticker } from '@stocks/models';

import { TickerCollectorController } from './ticker-collector.controller';
import { TickerCollectorService } from './ticker-collector.service';

@Module({
  controllers: [TickerCollectorController],
  exports: [TickerCollectorService],
  imports: [ConfigModule, HttpModule, TypeOrmModule.forFeature([Ticker])],
  providers: [TickerCollectorService],
})
export class TickerCollectorModule {}
