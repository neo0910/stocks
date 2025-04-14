import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DailyPrice } from '../models/daily-price.model';
import { OneHourPrice } from '../models/one-hour-price.model';
import { ScheduledTicker } from '../models/scheduled-ticker.model';
import { Ticker } from '../models/ticker.model';
import { User } from '../models/user.model';

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
  entities: [User, Ticker, DailyPrice, OneHourPrice, ScheduledTicker],
});
