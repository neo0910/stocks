import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DailyPrice } from '../../daily-price/daily-price.model';
import { OneMinPrice } from '../../one-min-price/one-min-price.model';
import { Ticker } from '../../ticker/ticker.model';
import { User } from '../../shared/models/user.model';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: +configService.get('POSTGRES_PORT'),
  database: configService.get('POSTGRES_DB'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  synchronize: Boolean(+configService.get('SYNC_DB')),
  entities: [User, Ticker, DailyPrice, OneMinPrice],
});
