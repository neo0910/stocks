import { Between, FindManyOptions, ILike, In, Or, Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';

import {
  OneHourPrice,
  OneHourPriceMessage,
  PRICE_ONE_HOUR_TOPIC,
  PriceDto,
  PriceQueryDto,
} from '@app/stocks-models';

import { TickerService } from '../ticker/ticker.service';

import {
  isOneHourPricesDBResultFull,
  processApiOneHourPricesResult,
  toISO,
} from './one-hour-price.utils';
import { TICKER_NOT_FOUND } from './one-hour-price.constants';

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

    const { isFull, daysList } = isOneHourPricesDBResultFull(dbResult, {
      from,
      to,
    });

    if (isFull) {
      return dbResult;
    }

    const ticker = await this.tickerService.findBySymbol(symbol);

    if (!ticker) {
      throw new BadGatewayException(TICKER_NOT_FOUND);
    }

    const apiResult = await lastValueFrom(
      this.oneHourPriceCollectorClient.send<PriceDto[], OneHourPriceMessage>(
        PRICE_ONE_HOUR_TOPIC,
        {
          daysList: daysList.map(toISO),
          ticker: symbol,
        },
      ),
    );

    return processApiOneHourPricesResult(apiResult, ticker, {
      start: from,
      end: to,
    });
  }
}
