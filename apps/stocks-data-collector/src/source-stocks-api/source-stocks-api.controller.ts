import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  DailyPriceMessage,
  OneHourPriceMessage,
  PRICE_DAILY_TOPIC,
  PRICE_ONE_HOUR_TOPIC,
  SearchTickersMessage,
  TICKERS_SEARCH_TOPIC,
} from '@app/stocks-models';

import { SourceStocksApiService } from './source-stocks-api.service';

@Controller()
export class SourceStocksApiController {
  constructor(
    private readonly sourceStocksApiService: SourceStocksApiService,
  ) {}

  @MessagePattern(TICKERS_SEARCH_TOPIC)
  async searchTickers(@Payload() { keywords }: SearchTickersMessage) {
    return this.sourceStocksApiService.findByKeywords(keywords);
  }

  @MessagePattern(PRICE_DAILY_TOPIC)
  async getDailyPrices(@Payload() { ticker }: DailyPriceMessage) {
    return this.sourceStocksApiService.getDailySeries(ticker);
  }

  @MessagePattern(PRICE_ONE_HOUR_TOPIC)
  async getOneHourPrices(@Payload() { daysList, ticker }: OneHourPriceMessage) {
    return this.sourceStocksApiService.getIntradaySeries(ticker, daysList);
  }
}
