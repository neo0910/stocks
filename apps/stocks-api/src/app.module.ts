import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getTypeOrmConfig } from '@app/stocks-models/configs/type-orm.config';

import { AuthModule } from './auth/auth.module';
import { DailyPriceModule } from './daily-price/daily-price.module';
import { OneMinPriceModule } from './one-min-price/one-min-price.module';
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
    TickerModule,
    TickerListModule,
    DailyPriceModule,
    OneMinPriceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
