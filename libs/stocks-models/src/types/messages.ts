export type SearchTickersMessage = {
  keywords: string;
};

export type DailyPriceMessage = {
  ticker: string;
};

export type OneHourPriceMessage = DailyPriceMessage & {
  from: string;
  to: string;
};
