import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';

import { DailyPrice, PriceDto } from '@app/stocks-models';

import { TickerCollectorService } from '../ticker-collector/ticker-collector.service';

@Injectable()
export class DailyPriceCollectorService {
  private readonly logger = new Logger(DailyPriceCollectorService.name);

  constructor(
    @InjectRepository(DailyPrice)
    private dailyPricesRepository: Repository<DailyPrice>,
    private readonly tickerCollectorService: TickerCollectorService,
  ) {}

  async createBulk(dtos: PriceDto[]): Promise<void> {
    if (!dtos.length) return;

    const ticker = await this.tickerCollectorService.findBySymbol(
      dtos[0].ticker,
    );

    if (!ticker) return;

    const dbQuery: FindManyOptions<DailyPrice> = {
      order: { dateTime: 'DESC' },
      skip: 0,
      take: 1,
      where: {
        ticker: {
          id: ticker.id,
        },
      },
    };

    const [latestTickerPrice] = await this.dailyPricesRepository.find(dbQuery);

    if (!latestTickerPrice) {
      await this.dailyPricesRepository.insert(
        dtos.map((dto) => ({ ...dto, ticker })),
      );

      return;
    }

    try {
      await this.dailyPricesRepository.insert(
        dtos
          .filter((dto) => new Date(dto.dateTime) > latestTickerPrice.dateTime)
          .map((dto) => ({ ...dto, ticker })),
      );
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.logger.error(error.message);
      } else {
        this.logger.error(error);
        throw error;
      }
    }
  }
}
