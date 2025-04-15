export const BASE_URL = 'https://www.alphavantage.co/query';

export const enum STOCK_API_FUNCTIONS {
  SEARCH = 'SYMBOL_SEARCH',
  DAILY_SERIES = 'TIME_SERIES_DAILY',
  SERIES_INTRADAY = 'TIME_SERIES_INTRADAY',
}

export const ENTRY_KEY_REGEXP = /\d\.\s/;

export const LIMIT_ERROR_SUBSTRINGS = [
  'detected',
  'limit',
  'requests',
  'limits',
];

export const LIMIT_EXCEEDED_ERROR = 'limit exceeded';
