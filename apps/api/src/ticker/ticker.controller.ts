import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';

import { TICKER_NOT_FOUND_ERROR } from './ticker.constants';
import { TickerService } from './ticker.service';

@UseGuards(JwtAuthGuard)
@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get('search')
  async search(@Query('keywords') keywords: string) {
    return await this.tickerService.findByKeywords(keywords);
  }

  @Get('get/:symbol')
  async getBySymbol(@Param('symbol') symbol: string) {
    const ticker = await this.tickerService.findBySymbol(symbol);

    if (!ticker) {
      throw new NotFoundException(TICKER_NOT_FOUND_ERROR);
    }

    return ticker;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tickerService.remove(id);
  }
}
