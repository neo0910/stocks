import { FindManyOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OneHourPrice, PriceDto } from '@app/stocks-models';

import { ScheduledTickerService } from '../scheduled-ticker/scheduled-ticker.service';
import { TickerCollectorService } from '../ticker-collector/ticker-collector.service';

@Injectable()
export class OneHourPriceCollectorService {
  constructor(
    @InjectRepository(OneHourPrice)
    private oneHourPricesRepository: Repository<OneHourPrice>,
    private readonly tickerCollectorService: TickerCollectorService,
    private readonly scheduledTickerService: ScheduledTickerService,
  ) {}

  async createBulkAndScheduleGathering(dtos: PriceDto[]): Promise<void> {
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

    await this.scheduledTickerService.scheduleGathering(ticker);
  }

  // collector
  // 4. schedule ticker 1hour data gathering via special db table - INCOMPLETED
  // 5. run job in the beginning of every day and go through sheduled tickers db table (createdAt + ASC) - INCOMPLETED
  // 6. delete records via transactions - INCOMPLETED
}
