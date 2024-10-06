import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { PriceDto } from '@app/stocks-models';

import { BASE_URL, STOCK_API_FUNCTIONS } from './source-stocks-api.constants';
import {
  FindByKeywordsParams,
  GetDailySeriesParams,
  GetIntradaySeriesParams,
  OutputSize,
  RawDailySeries,
  RawFindByKeywordsData,
  RawIntradaySeries,
} from './source-stocks-api.types';
import {
  getFormattedMonths,
  isResultError,
  processFindResult,
  processPriceResult,
} from './source-stocks-api.utils';

@Injectable()
export class SourceStocksApiService {
  token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.token = this.configService.get('STOCK_API_KEY') ?? '';
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

      const { isError } = isResultError(data);

      if (isError) {
        return [];
      }

      return processFindResult(data);
    } catch (e) {
      Logger.error(e);
    }
  }

  async getDailySeries(ticker: string): Promise<PriceDto[]> {
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

      const { isError } = isResultError(data);

      if (isError) {
        return [];
      }

      return processPriceResult(data, 'daily', ticker);
    } catch (e) {
      Logger.error(e);
    }
  }

  async getIntradaySeries(ticker: string, from: string, to: string) {
    const months = getFormattedMonths(from, to);

    const params: GetIntradaySeriesParams = {
      apikey: this.token,
      function: STOCK_API_FUNCTIONS.SERIES_INTRADAY,
      interval: '60min',
      month: months[0],
      outputsize: OutputSize.Full,
      symbol: ticker,
    };

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<RawIntradaySeries>(BASE_URL, { params }),
      );

      const { isError } = isResultError(data);

      if (isError) {
        return [];
      }

      return processPriceResult(data, '60min', ticker);
    } catch (e) {
      Logger.error(e);
    }
  }
}
