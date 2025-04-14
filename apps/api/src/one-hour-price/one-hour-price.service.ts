import { addHours } from 'date-fns';
import { Between, FindManyOptions, ILike, In, Or, Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';

import { filterOutExistedMonth } from '@stocks/models';
import {
  OneHourPrice,
  OneHourPriceMessage,
  PRICE_ONE_HOUR_TOPIC,
  PriceDto,
  PriceQueryDto,
} from '@stocks/models';
import { ScheduledStatus } from '@stocks/models';
import { TICKER_NOT_FOUND } from '@stocks/models';
import { toISO } from '@stocks/models';

import { ScheduledTickerService } from '../scheduled-ticker/scheduled-ticker.service';
import { TickerService } from '../ticker/ticker.service';
import {
  isOneHourPricesDBResultFull,
  processApiOneHourPricesResult,
} from './one-hour-price.utils';

@Injectable()
export class OneHourPriceService {
  constructor(
    @InjectRepository(OneHourPrice)
    private readonly oneHourPricesRepository: Repository<OneHourPrice>,
    @Inject('ONE_HOUR_PRICE_COLLECTOR_CLIENT')
    private readonly oneHourPriceCollectorClient: ClientKafka,
    private readonly scheduledTickerService: ScheduledTickerService,
    private readonly tickerService: TickerService
  ) {}

  async onModuleInit() {
    this.oneHourPriceCollectorClient.subscribeToResponseOf(
      PRICE_ONE_HOUR_TOPIC
    );

    await this.oneHourPriceCollectorClient.connect();
  }

  async get({
    from,
    to,
    symbol,
  }: PriceQueryDto): Promise<Partial<OneHourPrice>[]> {
    // get data from own database
    const dbQuery: FindManyOptions<OneHourPrice> = {
      order: { dateTime: 'ASC' },
      where: {
        dateTime: Or(
          Between(from, addHours(to, 23)),
          In([from.toISOString(), to.toISOString()])
        ),
        ticker: { symbol: ILike(symbol) },
      },
    };

    const dbResult = await this.oneHourPricesRepository.find(dbQuery);

    // quick check if data has no gaps
    const { isFull, daysList } = isOneHourPricesDBResultFull(dbResult, {
      from,
      to,
    });

    // return database response if result is full
    if (isFull) {
      return dbResult;
    }

    const ticker = await this.tickerService.findBySymbol(symbol);

    if (!ticker) {
      throw new NotFoundException(TICKER_NOT_FOUND);
    }

    // if db data has gaps - request scheduled tickers from own database with done status
    const doneScheduledTickers = await this.scheduledTickerService.get({
      from,
      status: ScheduledStatus.DONE,
      to,
      tickerId: ticker.id,
    });

    // remove gap-days from the list if they belong to scheduled tickers with done status (holidays for example)
    const notDoneDaysList = daysList.filter(
      filterOutExistedMonth(doneScheduledTickers)
    );

    // if all days removed from gaps list - return database result
    if (!notDoneDaysList.length) {
      return dbResult;
    }

    // request 3rd party API for the data and schedule ticker gathering
    const apiResult = await lastValueFrom(
      this.oneHourPriceCollectorClient.send<PriceDto[], OneHourPriceMessage>(
        PRICE_ONE_HOUR_TOPIC,
        {
          daysList: notDoneDaysList.map(toISO),
          ticker: symbol,
        }
      )
    );

    return processApiOneHourPricesResult(apiResult, ticker, {
      start: from,
      end: to,
    });
  }
}
