import { Entity, Unique } from 'typeorm';

import { Price } from './price.model';

@Entity()
@Unique('UQ_one_hour_price_datetime_ticker', ['dateTime', 'ticker'])
export class OneHourPrice extends Price {}
