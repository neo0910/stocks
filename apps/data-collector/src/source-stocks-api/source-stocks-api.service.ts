import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { PriceDto } from '@stocks/models';

import {
  BASE_URL,
  LIMIT_EXCEEDED_ERROR,
  STOCK_API_FUNCTIONS,
} from './source-stocks-api.constants';
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
  getFormattedMonth,
  isLimitExceededError,
  processFindResult,
  processPriceResult,
} from './source-stocks-api.utils';
import { AxiosResponse } from 'axios';

@Injectable()
export class SourceStocksApiService {
  private readonly logger = new Logger(SourceStocksApiService.name);

  token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.token = this.configService.get('STOCK_API_KEY') ?? '';
  }

  async findByKeywords(keywords: string) {
    const params: FindByKeywordsParams = {
      apikey: this.token,
      function: STOCK_API_FUNCTIONS.SEARCH,
      keywords,
    };

    let result: AxiosResponse<RawFindByKeywordsData>;

    try {
      result = await lastValueFrom(
        this.httpService.get<RawFindByKeywordsData>(BASE_URL, { params })
      );

      return processFindResult(result.data);
    } catch (e) {
      this.logger.error(e, result.data);
      return [];
    }
  }

  async getDailySeries(ticker: string): Promise<PriceDto[]> {
    const params: GetDailySeriesParams = {
      apikey: this.token,
      function: STOCK_API_FUNCTIONS.DAILY_SERIES,
      outputsize: OutputSize.Full,
      symbol: ticker,
    };

    let result: AxiosResponse<RawDailySeries>;

    try {
      result = await lastValueFrom(
        this.httpService.get<RawDailySeries>(BASE_URL, { params })
      );

      return processPriceResult(result.data, 'daily', ticker);
    } catch (e) {
      this.logger.error(e, result.data);
      return [];
    }
  }

  async getIntradaySeries(ticker: string, daysList: string[]) {
    const months = daysList.reduce(
      (acc, cur) => acc.add(getFormattedMonth(cur)),
      new Set<string>()
    );

    let lastData: RawIntradaySeries;

    const promises = [...months].map(async (month) => {
      const params: GetIntradaySeriesParams = {
        apikey: this.token,
        function: STOCK_API_FUNCTIONS.SERIES_INTRADAY,
        interval: '60min',
        month,
        outputsize: OutputSize.Full,
        symbol: ticker,
      };

      const { data } = await lastValueFrom(
        this.httpService.get<RawIntradaySeries>(BASE_URL, { params })
      );

      lastData = data;

      return processPriceResult(data, '60min', ticker);
    });

    try {
      return (await Promise.all(promises)).flat();
    } catch (e) {
      this.logger.error(e, lastData);
      return [];
    }
  }

  async gatherIntradaySeries(ticker: string, month: string) {
    const params: GetIntradaySeriesParams = {
      apikey: this.token,
      function: STOCK_API_FUNCTIONS.SERIES_INTRADAY,
      interval: '60min',
      month,
      outputsize: OutputSize.Full,
      symbol: ticker,
    };

    let result: AxiosResponse<RawIntradaySeries>;

    try {
      result = await lastValueFrom(
        this.httpService.get<RawIntradaySeries>(BASE_URL, { params })
      );

      return processPriceResult(result.data, '60min', ticker);
    } catch (e) {
      this.logger.error(e, result.data);

      if (isLimitExceededError(result.data)) {
        throw new Error(LIMIT_EXCEEDED_ERROR);
      }

      throw e;
    }
  }
}
