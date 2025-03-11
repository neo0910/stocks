import { format } from 'date-fns';

import {
  ScheduledStatus,
  ScheduledTicker,
} from '@app/stocks-models/models/scheduled-ticker.model';
import { STOCK_API_MONTH_PARAM_FORMAT } from '@app/stocks-models/constants';
import { Ticker } from '@app/stocks-models';

export const mapMonthsForGathering =
  (ticker: Ticker) => (item: Date, i: number, items: Date[]) => ({
    dateTime: format(item, STOCK_API_MONTH_PARAM_FORMAT),
    status:
      items.length - 1 === i
        ? ScheduledStatus.INCOMPLETED
        : ScheduledStatus.READY,
    ticker,
  });

export const getScheduledTickerSuccessLog = ({
  dateTime,
  status,
  ticker,
}: ScheduledTicker) => `
    Scheduled Ticker [${ticker.symbol}] ${ticker.name} for ${format(dateTime, STOCK_API_MONTH_PARAM_FORMAT)} date was gathered with status ${status}
  `;
