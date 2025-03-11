import { Cron } from '@nestjs/schedule';
import { eachMonthOfInterval, isSameMonth } from 'date-fns';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';

import { OLDEST_SUPPORTED_BY_API_DATE } from '@app/stocks-models/constants';
import { ScheduledStatus } from '@app/stocks-models/models/scheduled-ticker.model';
import { ScheduledTicker, Ticker } from '@app/stocks-models';
import { toISO } from '@app/stocks-models/utils/date.utils';

import {
  getScheduledTickerSuccessLog,
  mapMonthsForGathering,
} from './scheduled-ticker-collector.utils';
import { OneHourPriceCollectorService } from '../one-hour-price-collector/one-hour-price-collector.service';
import { SourceStocksApiService } from '../source-stocks-api/source-stocks-api.service';

@Injectable()
export class ScheduledTickerCollectorService {
  private readonly logger = new Logger(ScheduledTickerCollectorService.name);

  constructor(
    @InjectRepository(ScheduledTicker)
    private scheduledTickerRepository: Repository<ScheduledTicker>,
    private readonly oneHourPriceCollectorService: OneHourPriceCollectorService,
    private readonly sourceStocksApiService: SourceStocksApiService,
  ) {}

  async scheduleGathering(ticker: Ticker): Promise<void> {
    const eachMonths = eachMonthOfInterval({
      start: new Date(OLDEST_SUPPORTED_BY_API_DATE),
      end: new Date(),
    });

    await this.scheduledTickerRepository
      .createQueryBuilder()
      .insert()
      .into(ScheduledTicker)
      .values(eachMonths.map(mapMonthsForGathering(ticker)))
      .orIgnore()
      .execute();
  }

  @Cron('30 * * * * *')
  async gathering() {
    const dbQueryForOldestNotDoneScheduledTicker: FindManyOptions<ScheduledTicker> =
      {
        order: { createdAt: 'ASC' },
        skip: 0,
        take: 1,
        where: {
          status: In([
            ScheduledStatus.READY,
            ScheduledStatus.INCOMPLETED,
            ScheduledStatus.ERROR,
          ]),
        },
      };

    let requestLimitExceeded = false;

    for (let i = 0; !requestLimitExceeded; i++) {
      const [scheduledTicker] = await this.scheduledTickerRepository.find(
        dbQueryForOldestNotDoneScheduledTicker,
      );

      if (!scheduledTicker) {
        break;
      }

      try {
        // @TODO throw error if limit exceeded
        const res = await this.sourceStocksApiService.getIntradaySeries(
          scheduledTicker.ticker.symbol,
          [toISO(scheduledTicker.dateTime)],
        );

        await this.oneHourPriceCollectorService.createBulkAndScheduleGathering(
          res,
          { schedule: false },
        );

        scheduledTicker.status = isSameMonth(
          new Date(),
          scheduledTicker.dateTime,
        )
          ? ScheduledStatus.INCOMPLETED
          : ScheduledStatus.DONE;

        await scheduledTicker.save();

        this.logger.log(getScheduledTickerSuccessLog(scheduledTicker));
      } catch (error) {
        requestLimitExceeded = true;
      }
    }
  }
}
