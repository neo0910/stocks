import { Entity, Unique } from 'typeorm';

import { Price } from './price.model';

@Entity()
@Unique('UQ_daily_price_datetime_ticker', ['dateTime', 'ticker'])
export class DailyPrice extends Price {}
