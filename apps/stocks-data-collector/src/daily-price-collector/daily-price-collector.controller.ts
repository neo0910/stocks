import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PRICE_DAILY_REPLY_TOPIC, PriceDto } from '@app/stocks-models';

import { DailyPriceCollectorService } from './daily-price-collector.service';

@Controller()
export class DailyPriceCollectorController {
  constructor(
    private readonly dailyPriceCollectorService: DailyPriceCollectorService,
  ) {}

  @MessagePattern(PRICE_DAILY_REPLY_TOPIC)
  async createBulk(@Payload() message: PriceDto[]) {
    await this.dailyPriceCollectorService.createBulk(message);
  }
}
