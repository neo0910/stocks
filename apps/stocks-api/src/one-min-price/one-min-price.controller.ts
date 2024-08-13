import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TickerService } from '../ticker/ticker.service';

import { ONE_MIN_PRICES_NOT_FOUND_ERROR } from './one-min-price.constants';
import { OneMinPriceQueryDto } from './dto/one-min-price-query.dto';
import { OneMinPriceService } from './one-min-price.service';

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
@Controller('one-min-price')
export class OneMinPriceController {
  constructor(
    private readonly oneMinPriceService: OneMinPriceService,
    private readonly tickerService: TickerService,
  ) {}

  @Get()
  async get(@Query() { symbol, from, to }: OneMinPriceQueryDto) {
    const prices = await this.oneMinPriceService.get({ from, to, symbol });

    if (prices.length) {
      return prices;
    }

    throw new NotFoundException(ONE_MIN_PRICES_NOT_FOUND_ERROR);
  }
}
