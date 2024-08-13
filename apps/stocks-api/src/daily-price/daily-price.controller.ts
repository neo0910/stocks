import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TickerService } from '../ticker/ticker.service';

import { DailyPriceQueryDto } from './dto/daily-price-query.dto';
import { DailyPriceService } from './daily-price.service';

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
@Controller('daily-price')
export class DailyPriceController {
  constructor(
    private readonly dailyPriceService: DailyPriceService,
    private readonly tickerService: TickerService,
  ) {}

  @Get()
  async get(@Query() { symbol, from, to, ...restTicker }: DailyPriceQueryDto) {
    const prices = await this.dailyPriceService.get({ from, to, symbol });

    if (prices.length) {
      return prices;
    }

    let ticker = await this.tickerService.findBySymbol(symbol);

    if (!ticker) {
      ticker = await this.tickerService.create({ symbol, ...restTicker });
    }

    // const pricesFromApi = await this.stockApiService.getDailySeries(symbol);
    // await this.dailyPriceService.insert(pricesFromApi, ticker);

    return this.dailyPriceService.get({ from, to, symbol });
  }
}
