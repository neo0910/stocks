import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { TICKER_EXISTS_ERROR, TICKER_NOT_FOUND_ERROR } from './ticker.constants';
import { TickerDto } from './dto/ticker.dto';
import { TickerService } from './ticker.service';
import { ClientKafka } from '@nestjs/microservices';

@UseGuards(JwtAuthGuard)
@Controller('ticker')
export class TickerController {
  constructor(
    private readonly tickerService: TickerService,
    @Inject('STOCKS_DATA_COLLECTOR_CLIENT') private readonly stocksDataCollectorClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.stocksDataCollectorClient.subscribeToResponseOf('tickers.search');

    await this.stocksDataCollectorClient.connect();
  }

  @Get('get/:symbol')
  async getBySymbol(@Param('symbol') symbol: string) {
    const ticker = await this.tickerService.findBySymbol(symbol);

    if (!ticker) {
      throw new NotFoundException(TICKER_NOT_FOUND_ERROR);
    }

    return ticker;
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: TickerDto) {
    const candidate = await this.tickerService.findBySymbol(dto.symbol);

    if (candidate) {
      throw new BadRequestException(TICKER_EXISTS_ERROR);
    }

    return this.tickerService.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tickerService.remove(id);
  }

  @Get('search')
  async search(@Query('keywords') keywords: string) {
    return this.stocksDataCollectorClient.send('tickers.search', { keywords });
  }
}
