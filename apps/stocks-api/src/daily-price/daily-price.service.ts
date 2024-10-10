import { Between, FindManyOptions, ILike, In, Or, Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';

import {
  DailyPrice,
  PRICE_DAILY_TOPIC,
  PriceQueryDto,
  PriceDto,
} from '@app/stocks-models';

import { TickerService } from '../ticker/ticker.service';

import {
  isDailyPricesDBResultFull,
  processApiDailyPricesResult,
} from './daily-price.utils';
import { TICKER_NOT_FOUND } from './daily-price.constants';

@Injectable()
export class DailyPriceService {
  constructor(
    @InjectRepository(DailyPrice)
    private readonly dailyPricesRepository: Repository<DailyPrice>,
    @Inject('DAILY_PRICE_COLLECTOR_CLIENT')
    private readonly dailyPriceCollectorClient: ClientKafka,
    private readonly tickerService: TickerService,
  ) {}

  async onModuleInit() {
    this.dailyPriceCollectorClient.subscribeToResponseOf(PRICE_DAILY_TOPIC);

    await this.dailyPriceCollectorClient.connect();
  }

  async get({
    from,
    to,
    symbol,
  }: PriceQueryDto): Promise<Partial<DailyPrice>[]> {
    const dbQuery: FindManyOptions<DailyPrice> = {
      order: { dateTime: 'ASC' },
      where: {
        dateTime: Or(
          Between(from, to),
          In([from.toISOString(), to.toISOString()]),
        ),
        ticker: { symbol: ILike(symbol) },
      },
    };

    const dbResult = await this.dailyPricesRepository.find(dbQuery);

    if (isDailyPricesDBResultFull(dbResult, to)) {
      return dbResult;
    }

    const ticker = await this.tickerService.findBySymbol(symbol);

    if (!ticker) {
      throw new BadGatewayException(TICKER_NOT_FOUND);
    }

    const apiResult = await lastValueFrom(
      this.dailyPriceCollectorClient.send<PriceDto[], { ticker: string }>(
        PRICE_DAILY_TOPIC,
        {
          ticker: symbol,
        },
      ),
    );

    return processApiDailyPricesResult(apiResult, ticker, {
      start: from,
      end: to,
    });
  }
}
