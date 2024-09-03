import { DailyPrice } from '@app/stocks-models';

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
