import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PRICE_ONE_HOUR_REPLY_TOPIC, PriceDto } from '@app/stocks-models';

import { OneHourPriceCollectorService } from './one-hour-price-collector.service';

@Controller()
export class OneHourPriceCollectorController {
  constructor(
    private readonly oneHourPriceCollectorService: OneHourPriceCollectorService,
  ) {}

  @MessagePattern(PRICE_ONE_HOUR_REPLY_TOPIC)
  async createBulk(@Payload() message: PriceDto[]) {
    await this.oneHourPriceCollectorService.createBulk(message);
  }
}
