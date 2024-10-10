import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { OneHourPrice, PriceDto } from '@app/stocks-models';

import { TickerCollectorService } from '../ticker-collector/ticker-collector.service';

@Injectable()
export class OneHourPriceCollectorService {
  constructor(
    @InjectRepository(OneHourPrice)
    private oneHourPricesRepository: Repository<OneHourPrice>,
    private readonly tickerCollectorService: TickerCollectorService,
  ) {}

  // 1. to do request to db - DONE
  // 2. if response is not "empty" - return result - DONE
  // 3a. if is "empty" - trigger "price.one-hour" kafka event and get only necessary data (months) from 3rd API - DONE
  // 3b. store result to db - INCOMPLETED
  // 3c. return result - DONE
  // collector
  // 4. subscribe on price.one-hour (where) and schedule ticker 1hour data gathering via special db table - INCOMPLETED
  // 5. run job in the beginning of every day and go through sheduled tickers db table (createdAt + ASC) - INCOMPLETED
  // 6. delete records via transactions - INCOMPLETED

  // async insert(prices: any[], ticker: Ticker): Promise<void> {
  //   await this.oneHourPricesRepository.save(
  //     prices.map((price) => ({ ...price, ticker })),
  //     { chunk: prices.length / 1000 },
  //   );
  // }

  async createBulk(dtos: PriceDto[]): Promise<void> {
    console.log('dtos :>> ', dtos);
    return;
    if (!dtos.length) return;

    const ticker = await this.tickerCollectorService.findBySymbol(
      dtos[0].ticker,
    );

    if (!ticker) return;

    const dbQuery: FindManyOptions<OneHourPrice> = {
      order: { dateTime: 'DESC' },
      skip: 0,
      take: 1,
      where: {
        ticker: {
          id: ticker.id,
        },
      },
    };

    const [latestTickerPrice] =
      await this.oneHourPricesRepository.find(dbQuery);

    if (!latestTickerPrice) {
      await this.oneHourPricesRepository.insert(
        dtos.map((dto) => ({ ...dto, ticker })),
      );

      return;
    }

    await this.oneHourPricesRepository.insert(
      dtos
        .filter((dto) => new Date(dto.dateTime) > latestTickerPrice.dateTime)
        .map((dto) => ({ ...dto, ticker })),
    );
  }
}
