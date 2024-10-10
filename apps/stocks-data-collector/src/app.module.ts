import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getTypeOrmConfig } from '@app/stocks-models';

import { DailyPriceCollectorModule } from './daily-price-collector/daily-price-collector.module';
import { OneHourPriceCollectorModule } from './one-hour-price-collector/one-hour-price-collector.module';
import { SourceStocksApiModule } from './source-stocks-api/source-stocks-api.module';
import { TickerCollectorModule } from './ticker-collector/ticker-collector.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
    }),
    DailyPriceCollectorModule,
    OneHourPriceCollectorModule,
    SourceStocksApiModule,
    TickerCollectorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
