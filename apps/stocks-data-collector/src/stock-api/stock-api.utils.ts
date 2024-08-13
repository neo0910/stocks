import { ENTRY_KEY_REGEXP } from './stock-api.constants';
import {
  FindByKeywordsData,
  ProcessedPrice,
  RawDailySeries,
  RawFindByKeywordsData,
  RawIntradaySeries,
} from './stock-api.types';

export const processFindResult = ({
  bestMatches,
}: RawFindByKeywordsData): FindByKeywordsData[] => {
  return bestMatches.map<FindByKeywordsData>((entry) =>
    Object.keys(entry).reduce((acc, cur) => {
      acc[cur.replace(ENTRY_KEY_REGEXP, '')] = entry[cur];
      return acc;
    }, {} as FindByKeywordsData),
  );
};

export const processPriceResult = (
  rawDailySeries: RawDailySeries | RawIntradaySeries,
  interval: 'daily' | '1min',
): ProcessedPrice[] => {
  const seriesKey =
    interval === 'daily' ? 'Time Series (Daily)' : 'Time Series (1min)';

  return Object.entries(rawDailySeries[seriesKey]).map<ProcessedPrice>(
    ([key, value]) => {
      const entry = Object.keys(value).reduce(
        (acc, cur) => {
          acc[cur.replace(ENTRY_KEY_REGEXP, '')] = parseFloat(value[cur]);
          return acc;
        },
        {} as Omit<ProcessedPrice, 'dateTime'>,
      );

      return { ...entry, dateTime: key };
    },
  );
};

export const getMonthParam = (dateTime: string): string => dateTime.slice(0, 7);
