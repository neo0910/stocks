import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TickerDto } from '@app/stocks-models';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';

import {
  TICKER_EXISTS_ERROR,
  TICKER_NOT_FOUND_ERROR,
} from './ticker.constants';
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

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: TickerDto) {
    const candidate = await this.tickerService.findBySymbol(dto.symbol);

    if (candidate) {
      throw new BadRequestException(TICKER_EXISTS_ERROR);
    }

    return this.tickerService.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tickerService.remove(id);
  }
}
