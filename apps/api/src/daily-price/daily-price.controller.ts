import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { PriceQueryDto } from '@stocks/models';

import { DailyPriceService } from './daily-price.service';

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  })
)
@Controller('daily-price')
export class DailyPriceController {
  constructor(private readonly dailyPriceService: DailyPriceService) {}

  @Get()
  async get(@Query() queryDto: PriceQueryDto) {
    return await this.dailyPriceService.get(queryDto);
  }
}
