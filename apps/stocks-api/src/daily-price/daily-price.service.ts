import { Between, FindManyOptions, ILike, In, Or, Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';

import { DailyPrice, PriceDto } from '@app/stocks-models';

import { TickerService } from '../ticker/ticker.service';

import { DailyPriceQueryDto } from './dto/daily-price-query.dto';
import {
  isDailyPricesDBResultFull,
  processApiDailyPricesResult,
} from './daily-price.utils';

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
    this.dailyPriceCollectorClient.subscribeToResponseOf('price.daily');

    await this.dailyPriceCollectorClient.connect();
  }

  async get({
    from,
    to,
    symbol,
  }: DailyPriceQueryDto): Promise<Partial<DailyPrice>[]> {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    const dbQuery: FindManyOptions<DailyPrice> = {
      order: { dateTime: 'ASC' },
      where: {
        dateTime: Or(
          Between(dateFrom, dateTo),
          In([dateFrom.toISOString(), dateTo.toISOString()]),
        ),
        ticker: { symbol: ILike(symbol) },
      },
    };

    const dbResult = await this.dailyPricesRepository.find(dbQuery);

    if (isDailyPricesDBResultFull(dbResult, to)) {
      return dbResult;
    }

    const apiResult = await lastValueFrom(
      this.dailyPriceCollectorClient.send<PriceDto[], { ticker: string }>(
        'price.daily',
        {
          ticker: symbol,
        },
      ),
    );

    const ticker = await this.tickerService.findBySymbol(symbol);

    return processApiDailyPricesResult(apiResult, ticker, {
      start: dateFrom,
      end: dateTo,
    });
  }
}
