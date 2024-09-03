import { PriceDto, TickerDto } from '@app/stocks-models';

import { ENTRY_KEY_REGEXP } from './source-stocks-api.constants';
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

export const processPriceResult = (
  rawDailySeries: RawDailySeries | RawIntradaySeries,
  interval: 'daily' | '1min',
  ticker: string,
): PriceDto[] => {
  const seriesKey =
    interval === 'daily' ? 'Time Series (Daily)' : 'Time Series (1min)';

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

export const getMonthParam = (dateTime: string): string => dateTime.slice(0, 7);
