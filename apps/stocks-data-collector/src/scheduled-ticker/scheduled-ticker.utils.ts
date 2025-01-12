import { format, isSameMonth } from 'date-fns';

import { ScheduledStatus } from '@app/stocks-models/models/scheduled-ticker.model';
import { ScheduledTicker, Ticker } from '@app/stocks-models';
import { STOCK_API_MONTH_PARAM_FORMAT } from '@app/stocks-models/constants';

export const filterOutExistedMonth =
  (existedMonths: ScheduledTicker[]) => (month: Date) => {
    if (!existedMonths.length) return true;

    return !existedMonths.every(({ dateTime }) => isSameMonth(dateTime, month));
  };

export const mapMonthsForGathering =
  (ticker: Ticker) => (item: Date, i: number, items: Date[]) => ({
    dateTime: format(item, STOCK_API_MONTH_PARAM_FORMAT),
    status:
      items.length - 1 === i
        ? ScheduledStatus.INCOMPLETED
        : ScheduledStatus.READY,
    ticker,
  });
