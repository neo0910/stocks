import { STOCK_API_FUNCTIONS } from './source-stocks-api.constants';

interface Params {
  apikey: string;
  function: STOCK_API_FUNCTIONS;
}

export enum OutputSize {
  Compact = 'compact',
  Full = 'full',
}

export interface FindByKeywordsParams extends Params {
  keywords: string;
}

export interface GetDailySeriesParams extends Params {
  outputsize: OutputSize;
  symbol: string;
}

export interface GetIntradaySeriesParams extends Params {
  interval: '1min' | '5min' | '15min' | '30min' | '60min';
  month: string;
  outputsize: OutputSize;
  symbol: string;
}

export type RawFindByKeywordsData = {
  bestMatches: Record<string, string>[];
};

type RawPrice = {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
};

export type RawDailySeries = {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [key: string]: RawPrice;
  };
};

export type RawIntradaySeries = {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Interval': string;
    '5. Output Size': string;
    '6. Time Zone': string;
  };
  'Time Series (1min)': {
    [key: string]: RawPrice;
  };
};
