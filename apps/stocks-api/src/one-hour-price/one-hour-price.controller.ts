import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { PriceQueryDto } from '@app/stocks-models';

import { OneHourPriceService } from './one-hour-price.service';

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
@Controller('one-hour-price')
export class OneHourPriceController {
  constructor(private readonly oneHourPriceService: OneHourPriceService) {}

  @Get()
  async get(@Query() queryDto: PriceQueryDto) {
    return await this.oneHourPriceService.get(queryDto);
  }
}
