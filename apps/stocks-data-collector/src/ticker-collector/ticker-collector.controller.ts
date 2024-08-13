import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TickerCollectorService } from './ticker-collector.service';

@Controller()
export class TickerCollectorController {
  constructor(private readonly stockApiService: TickerCollectorService) {}

  @MessagePattern('tickers.search.reply')
  async search(@Payload() message) {
    console.log('message :>> ', message);
  }
}
