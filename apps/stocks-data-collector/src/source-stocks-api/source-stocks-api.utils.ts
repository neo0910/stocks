import { format } from 'date-fns';

import { PriceDto, TickerDto } from '@app/stocks-models';
import { STOCK_API_MONTH_PARAM_FORMAT } from '@app/stocks-models/constants';

import {
  ENTRY_KEY_REGEXP,
  ERROR_RESULT_KEY,
} from './source-stocks-api.constants';
import {
  RawDailySeries,
  RawFindByKeywordsData,
  RawIntradaySeries,
} from './source-stocks-api.types';

export const processFindResult = ({
  bestMatches,
}: RawFindByKeywordsData): TickerDto[] => {
  return bestMatches.map<TickerDto>((entry) =>
    Object.keys(entry).reduce((acc, cur) => {
      acc[cur.replace(ENTRY_KEY_REGEXP, '')] = entry[cur];
      return acc;
    }, {} as TickerDto),
  );
};

export const isResultError = (
  data: RawDailySeries | RawIntradaySeries | RawFindByKeywordsData | string,
) => {
  if (!data[ERROR_RESULT_KEY]) {
    return { isError: false };
  }

  return { isError: true, message: data[ERROR_RESULT_KEY] as string };
};

export const processPriceResult = (
  rawDailySeries: RawDailySeries | RawIntradaySeries,
  interval: 'daily' | '60min',
  ticker: string,
): PriceDto[] => {
  const seriesKey =
    interval === 'daily' ? 'Time Series (Daily)' : 'Time Series (60min)';

  return Object.entries(rawDailySeries[seriesKey]).map<PriceDto>(
    ([key, value]) => {
      const entry = Object.keys(value).reduce(
        (acc, cur) => {
          acc[cur.replace(ENTRY_KEY_REGEXP, '')] = parseFloat(value[cur]);
          return acc;
        },
        {} as Omit<PriceDto, 'dateTime'>,
      );

      return { ...entry, dateTime: key, ticker };
    },
  );
};

export const getFormattedMonth = (dateString: string) =>
  format(new Date(dateString), STOCK_API_MONTH_PARAM_FORMAT);
