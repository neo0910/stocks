import {
  compareAsc,
  eachDayOfInterval,
  eachWeekendOfInterval,
  Interval,
  isSameDay,
  isWithinInterval,
} from 'date-fns';

import {
  OneHourPrice,
  ONE_MINUTE_IN_MS,
  PriceDto,
  Ticker,
} from '@app/stocks-models';
import { toISO } from '@app/stocks-models/utils/date.utils';

const dateWithoutOffset = (d: Date): Date => {
  const copiedDate = new Date(d.getTime());
  const offsetInMS = copiedDate.getTimezoneOffset() * ONE_MINUTE_IN_MS;

  return new Date(copiedDate.getTime() - offsetInMS);
};

/**
 * @param result should be SORTED ASC for this check
 */
export const isOneHourPricesDBResultFull = (
  result: OneHourPrice[],
  { from, to }: { from: Date; to: Date },
): { isFull: boolean; daysList: Date[] } => {
  const interval = { start: from, end: to };

  if (!result.length) {
    return {
      isFull: false,
      daysList: eachDayOfInterval(interval).map(dateWithoutOffset),
    };
  }

  const eachDay = eachDayOfInterval(interval).map(dateWithoutOffset);
  const eachWeekendISOStrings = eachWeekendOfInterval(interval)
    .map(dateWithoutOffset)
    .map(toISO);

  const eachWorkingDay = eachDay.filter(
    (d) => !eachWeekendISOStrings.includes(d.toISOString()),
  );

  const missingDaysList = eachWorkingDay.filter(
    (day) => !result.some(({ dateTime }) => isSameDay(dateTime, day)),
  );

  if (missingDaysList.length) {
    return { isFull: false, daysList: missingDaysList };
  }

  return { isFull: true, daysList: [] };
};

export const processApiOneHourPricesResult = (
  result: PriceDto[],
  ticker: Ticker,
  interval: Interval<Date>,
) =>
  result
    .filter(({ dateTime }) => isWithinInterval(new Date(dateTime), interval))
    .map((price) => ({ ...price, dateTime: new Date(price.dateTime), ticker }))
    .sort((a, b) => compareAsc(a.dateTime, b.dateTime));
