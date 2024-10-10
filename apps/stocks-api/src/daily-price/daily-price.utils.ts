import { compareAsc, Interval, isWithinInterval } from 'date-fns';

import { DailyPrice, PriceDto, Ticker } from '@app/stocks-models';

const enum Weekends {
  Sunday = 0,
  Saturday = 6,
}

const convertWeekendToWorkingDay = (
  date: Date,
  convertDirection: 'back' | 'forward',
) => {
  const copiedDate = new Date(date.getTime());
  const directionMultiplier = convertDirection === 'back' ? -1 : 1;

  if (copiedDate.getDay() === Weekends.Sunday) {
    copiedDate.setDate(copiedDate.getDate() + directionMultiplier * 2);
    return copiedDate;
  }

  if (copiedDate.getDay() === Weekends.Saturday) {
    copiedDate.setDate(copiedDate.getDate() + directionMultiplier * 1);
    return copiedDate;
  }

  return copiedDate;
};

/**
 * @param result should be SORTED ASC for this check
 */
export const isDailyPricesDBResultFull = (result: DailyPrice[], to: Date) => {
  if (!result.length) {
    return false;
  }

  const dateTo = convertWeekendToWorkingDay(to, 'back');

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
