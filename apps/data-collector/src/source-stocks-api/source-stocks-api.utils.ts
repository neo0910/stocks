import { format } from 'date-fns';
import { isString } from 'class-validator';

import { PriceDto, TickerDto } from '@stocks/models';
import { STOCK_API_MONTH_PARAM_FORMAT } from '@stocks/models';

import {
  ENTRY_KEY_REGEXP,
  LIMIT_ERROR_SUBSTRINGS,
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
    }, {} as TickerDto)
  );
};

export const isLimitExceededError = (data: Record<string, unknown>) => {
  const allStringValues = Object.values(data)
    .filter(isString)
    .reduce((acc, cur) => acc + cur, '');

  return LIMIT_ERROR_SUBSTRINGS.some((substr) =>
    allStringValues.includes(substr)
  );
};

export const processPriceResult = (
  rawDailySeries: RawDailySeries | RawIntradaySeries,
  interval: 'daily' | '60min',
  ticker: string
): PriceDto[] => {
  const seriesKey =
    interval === 'daily' ? 'Time Series (Daily)' : 'Time Series (60min)';

  return Object.entries(rawDailySeries[seriesKey]).map<PriceDto>(
    ([key, value]) => {
      const entry = Object.keys(value).reduce((acc, cur) => {
        acc[cur.replace(ENTRY_KEY_REGEXP, '')] = parseFloat(value[cur]);
        return acc;
      }, {} as Omit<PriceDto, 'dateTime'>);

      return { ...entry, dateTime: key, ticker };
    }
  );
};

export const getFormattedMonth = (dateString: string) =>
  format(new Date(dateString), STOCK_API_MONTH_PARAM_FORMAT);
