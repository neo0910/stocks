import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { SourceStocksApiService } from './source-stocks-api.service';

@Controller()
export class SourceStocksApiController {
  constructor(
    private readonly sourceStocksApiService: SourceStocksApiService,
  ) {}

  @MessagePattern('tickers.search')
  async searchTickers(@Payload() message: { keywords: string }) {
    return this.sourceStocksApiService.findByKeywords(message.keywords);
  }

  @MessagePattern('price.daily')
  async getDailyPrices(@Payload() message: { ticker: string }) {
    return this.sourceStocksApiService.getDailySeries(message.ticker);
  }
}
