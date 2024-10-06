import { Between, FindManyOptions, ILike, In, Or, Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';

import {
  OneHourPrice,
  OneHourPriceMessage,
  PRICE_ONE_HOUR_TOPIC,
  PriceDto,
  PriceQueryDto,
  Ticker,
} from '@app/stocks-models';

import { TickerService } from '../ticker/ticker.service';

import { processApiOneHourPricesResult } from './one-hour-price.utils';

@Injectable()
export class OneHourPriceService {
  constructor(
    @InjectRepository(OneHourPrice)
    private readonly oneHourPricesRepository: Repository<OneHourPrice>,
    @Inject('ONE_HOUR_PRICE_COLLECTOR_CLIENT')
    private readonly oneHourPriceCollectorClient: ClientKafka,
    private readonly tickerService: TickerService,
  ) {}

  async onModuleInit() {
    this.oneHourPriceCollectorClient.subscribeToResponseOf(
      PRICE_ONE_HOUR_TOPIC,
    );

    await this.oneHourPriceCollectorClient.connect();
  }

  async get({
    from,
    to,
    symbol,
  }: PriceQueryDto): Promise<Partial<OneHourPrice>[]> {
    const dbQuery: FindManyOptions<OneHourPrice> = {
      order: { dateTime: 'ASC' },
      where: {
        dateTime: Or(
          Between(from, to),
          In([from.toISOString(), to.toISOString()]),
        ),
        ticker: { symbol: ILike(symbol) },
      },
    };

    const dbResult = await this.oneHourPricesRepository.find(dbQuery);

    // @TODO add smart check for dbResult
    if (dbResult.length) {
      return dbResult;
    }

    // 1. to do request to db - DONE
    // 2. if response is not "empty" - return result - INCOMPLETED
    // 3a. if is "empty" - trigger "price.one-hour" kafka event and get only necessary data (months) from 3rd API - DONE
    // 3b. store result to db - INCOMPLETED
    // 3c. return result - DONE
    // collector
    // 4. subscribe on price.one-hour (where) and schedule ticker 1hour data gathering via special db table - INCOMPLETED
    // 5. run job in the beginning of every day and go through sheduled tickers db table (createdAt + ASC) - INCOMPLETED
    // 6. delete records via transactions - INCOMPLETED

    const apiResult = await lastValueFrom(
      this.oneHourPriceCollectorClient.send<PriceDto[], OneHourPriceMessage>(
        PRICE_ONE_HOUR_TOPIC,
        {
          from: from.toISOString(),
          ticker: symbol,
          to: to.toISOString(),
        },
      ),
    );

    // @TODO getOrCreateTicker
    const ticker = await this.tickerService.findBySymbol(symbol);

    return processApiOneHourPricesResult(apiResult, ticker, {
      start: from,
      end: to,
    });
  }

  // keep for future use
  async insert(prices: any[], ticker: Ticker): Promise<void> {
    await this.oneHourPricesRepository.save(
      prices.map((price) => ({ ...price, ticker })),
      { chunk: prices.length / 1000 },
    );
  }
}
