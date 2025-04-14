import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OneHourPrice, PriceDto } from '@stocks/models';
import { TICKER_NOT_FOUND } from '@stocks/models';

import { ScheduledTickerCollectorService } from '../scheduled-ticker-collector/scheduled-ticker-collector.service';
import { TickerCollectorService } from '../ticker-collector/ticker-collector.service';

@Injectable()
export class OneHourPriceCollectorService {
  private readonly logger = new Logger(OneHourPriceCollectorService.name);

  constructor(
    @InjectRepository(OneHourPrice)
    private oneHourPricesRepository: Repository<OneHourPrice>,
    private readonly tickerCollectorService: TickerCollectorService,
    @Inject(forwardRef(() => ScheduledTickerCollectorService))
    private readonly scheduledTickerService: ScheduledTickerCollectorService
  ) {}

  async createBulkAndScheduleGathering(
    dtos: PriceDto[],
    options = { schedule: true }
  ): Promise<void> {
    if (!dtos.length) {
      this.logger.log('Empty payload for createBulk');
      return;
    }

    const ticker = await this.tickerCollectorService.findBySymbol(
      dtos[0].ticker
    );

    if (!ticker) {
      throw new NotFoundException(TICKER_NOT_FOUND);
    }

    await this.oneHourPricesRepository
      .createQueryBuilder()
      .insert()
      .into(OneHourPrice)
      .values(dtos.map((dto) => ({ ...dto, ticker })))
      .orIgnore()
      .execute();

    if (options.schedule) {
      await this.scheduledTickerService.scheduleGathering(ticker);
    }
  }
}
