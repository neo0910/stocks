import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TickerDto, TICKERS_SEARCH_REPLY_TOPIC } from '@app/stocks-models';

import { TickerCollectorService } from './ticker-collector.service';

@Controller()
export class TickerCollectorController {
  constructor(
    private readonly tickerCollectorService: TickerCollectorService,
  ) {}

  @UsePipes(new ValidationPipe())
  @MessagePattern(TICKERS_SEARCH_REPLY_TOPIC)
  async createBulk(@Payload() message: TickerDto[]) {
    await this.tickerCollectorService.createBulk(message);
  }
}
