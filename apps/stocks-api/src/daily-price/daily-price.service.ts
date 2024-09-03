import { Between, FindManyOptions, ILike, In, Or, Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';

import { DailyPrice, PriceDto } from '@app/stocks-models';

import { DailyPriceQueryDto } from './dto/daily-price-query.dto';
import { isDailyPricesDBResultFull } from './daily-price.utils';

@Injectable()
export class DailyPriceService {
  constructor(
    @InjectRepository(DailyPrice)
    private dailyPricesRepository: Repository<DailyPrice>,
    @Inject('DAILY_PRICE_COLLECTOR_CLIENT')
    private readonly dailyPriceCollectorClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.dailyPriceCollectorClient.subscribeToResponseOf('price.daily');

    await this.dailyPriceCollectorClient.connect();
  }

  async get({
    from,
    to,
    symbol,
  }: DailyPriceQueryDto): Promise<DailyPrice[] | Observable<PriceDto[]>> {
    const dbQuery: FindManyOptions<DailyPrice> = {
      order: { dateTime: 'ASC' },
      where: {
        dateTime: Or(
          In([new Date(from).toISOString(), new Date(to).toISOString()]),
          Between(new Date(from), new Date(to)),
        ),
        ticker: { symbol: ILike(symbol) },
      },
    };

    const result = await this.dailyPricesRepository.find(dbQuery);

    if (isDailyPricesDBResultFull(result, to)) {
      return result;
    }

    // needs to be filtered with from/to
    return this.dailyPriceCollectorClient.send<PriceDto[], { ticker: string }>(
      'price.daily',
      { ticker: symbol },
    );
  }
}
