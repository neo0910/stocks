import { compareAsc, Interval, isWithinInterval } from 'date-fns';

import { DailyPrice, PriceDto, Ticker } from '@app/stocks-models';

import { Weekends } from './daily-price.constants';

export const isDailyPricesDBResultFull = (result: DailyPrice[], to: string) => {
  if (!result.length) {
    return false;
  }

  const convertWeekendToWorkingDay = (date: Date) => {
    if (date.getDay() === Weekends.Sunday) {
      date.setDate(date.getDate() - 2);
      return date;
    }

    if (date.getDay() === Weekends.Saturday) {
      date.setDate(date.getDate() - 1);
      return date;
    }

    return date;
  };

  const dateTo = convertWeekendToWorkingDay(new Date(to));

  return dateTo.getTime() === result.at(-1).dateTime.getTime();
};

export const processApiDailyPricesResult = (
  result: PriceDto[],
  ticker: Ticker,
  interval: Interval<Date>,
) =>
  result
    .filter(({ dateTime }) => isWithinInterval(new Date(dateTime), interval))
    .map((price) => ({ ...price, dateTime: new Date(price.dateTime), ticker }))
    .sort((a, b) => compareAsc(a.dateTime, b.dateTime));
