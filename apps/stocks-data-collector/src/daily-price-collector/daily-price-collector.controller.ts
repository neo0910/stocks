import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PriceDto } from '@app/stocks-models';

import { DailyPriceCollectorService } from './daily-price-collector.service';

@Controller()
export class DailyPriceCollectorController {
  constructor(
    private readonly dailyPriceCollectorService: DailyPriceCollectorService,
  ) {}

  @MessagePattern('price.daily.reply')
  async createBulk(@Payload() message: PriceDto[]) {
    await this.dailyPriceCollectorService.createBulk(message);
  }
}
