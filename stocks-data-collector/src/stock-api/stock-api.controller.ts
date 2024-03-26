import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { StockApiService } from './stock-api.service';

@Controller()
export class StockApiController {
  constructor(private readonly stockApiService: StockApiService) {}

  @MessagePattern('tickers.search')
  async search(@Payload() message: { keywords: string }) {
    return this.stockApiService.findByKeywords(message.keywords);
  }
}
