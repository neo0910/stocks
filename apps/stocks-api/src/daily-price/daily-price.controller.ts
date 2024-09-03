import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

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
  constructor(private readonly dailyPriceService: DailyPriceService) {}

  @Get()
  async get(@Query() { symbol, from, to }: DailyPriceQueryDto) {
    return await this.dailyPriceService.get({ from, to, symbol });
  }
}
