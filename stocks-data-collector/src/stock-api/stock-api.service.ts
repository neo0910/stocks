import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import {
  BASE_URL,
  ENTRY_KEY_REGEXP,
  STOCK_API_FUNCTIONS,
} from './stock-api.constants';
import {
  FindByKeywordsData,
  FindByKeywordsParams,
  GetDailySeriesParams,
  GetIntradaySeriesParams,
  OutputSize,
  ProcessedPrice,
  RawDailySeries,
  RawFindByKeywordsData,
  RawIntradaySeries,
} from './stock-api.types';

@Injectable()
export class StockApiService {
  token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.token = this.configService.get('STOCK_API_KEY') ?? '';
  }

  private processFindResult({
    bestMatches,
  }: RawFindByKeywordsData): FindByKeywordsData[] {
    return bestMatches.map<FindByKeywordsData>((entry) =>
      Object.keys(entry).reduce((acc, cur) => {
        acc[cur.replace(ENTRY_KEY_REGEXP, '')] = entry[cur];
        return acc;
      }, {} as FindByKeywordsData),
    );
  }

  private processPriceResult(
    rawDailySeries: RawDailySeries | RawIntradaySeries,
    interval: 'daily' | '1min',
  ): ProcessedPrice[] {
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
  }

  private getMonthParam(dateTime: string): string {
    return dateTime.slice(0, 7);
  }

  async findByKeywords(keywords: string) {
    const params: FindByKeywordsParams = {
      apikey: this.token,
      function: STOCK_API_FUNCTIONS.SEARCH,
      keywords,
    };

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<RawFindByKeywordsData>(BASE_URL, { params }),
      );

      return this.processFindResult(data);
    } catch (e) {
      Logger.error(e);
    }
  }

  async getDailySeries(ticker: string): Promise<ProcessedPrice[]> {
    const params: GetDailySeriesParams = {
      apikey: this.token,
      function: STOCK_API_FUNCTIONS.DAILY_SERIES,
      outputsize: OutputSize.Full,
      symbol: ticker,
    };

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<RawDailySeries>(BASE_URL, { params }),
      );

      return this.processPriceResult(data, 'daily');
    } catch (e) {
      Logger.error(e);
    }
  }

  async getIntradaySeries(ticker: string, from: string, to: string) {
    const month = this.getMonthParam(from);

    const params: GetIntradaySeriesParams = {
      apikey: this.token,
      function: STOCK_API_FUNCTIONS.SERIES_INTRADAY,
      interval: '1min',
      month,
      outputsize: OutputSize.Full,
      symbol: ticker,
    };

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<RawIntradaySeries>(BASE_URL, { params }),
      );

      return this.processPriceResult(data, '1min');
    } catch (e) {
      Logger.error(e);
    }
  }
}
