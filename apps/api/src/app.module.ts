import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getTypeOrmConfig } from '@stocks/models';

import { AuthModule } from './auth/auth.module';
import { DailyPriceModule } from './daily-price/daily-price.module';
import { OneHourPriceModule } from './one-hour-price/one-hour-price.module';
import { TickerListModule } from './ticker-list/ticker-list.module';
import { TickerModule } from './ticker/ticker.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
    }),
    AuthModule,
    DailyPriceModule,
    OneHourPriceModule,
    TickerListModule,
    TickerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
