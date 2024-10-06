import { compareAsc, Interval, isWithinInterval } from 'date-fns';

import { PriceDto, Ticker } from '@app/stocks-models';

export const processApiOneHourPricesResult = (
  result: PriceDto[],
  ticker: Ticker,
  interval: Interval<Date>,
) =>
  result
    .filter(({ dateTime }) => isWithinInterval(new Date(dateTime), interval))
    .map((price) => ({ ...price, dateTime: new Date(price.dateTime), ticker }))
    .sort((a, b) => compareAsc(a.dateTime, b.dateTime));
