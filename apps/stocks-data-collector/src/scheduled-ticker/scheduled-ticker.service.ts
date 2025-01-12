import { eachMonthOfInterval } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OLDEST_SUPPORTED_BY_API_DATE } from '@app/stocks-models/constants';
import { ScheduledTicker, Ticker } from '@app/stocks-models';

import {
  filterOutExistedMonth,
  mapMonthsForGathering,
} from './scheduled-ticker.utils';

@Injectable()
export class ScheduledTickerService {
  constructor(
    @InjectRepository(ScheduledTicker)
    private scheduledTickerRepository: Repository<ScheduledTicker>,
  ) {}

  async scheduleGathering(ticker: Ticker): Promise<void> {
    const eachMonths = eachMonthOfInterval({
      start: new Date(OLDEST_SUPPORTED_BY_API_DATE),
      end: new Date(),
    });

    const existedMonthsForTicker = await this.scheduledTickerRepository.findBy({
      ticker: { id: ticker.id },
    });

    const itemsForInsertion = eachMonths
      .filter(filterOutExistedMonth(existedMonthsForTicker))
      .map(mapMonthsForGathering(ticker));

    // @TODO issue here
    console.log('itemsForInsertion :>> ', itemsForInsertion);
    console.log('existedMonthsForTicker :>> ', existedMonthsForTicker.length);

    await this.scheduledTickerRepository.insert(itemsForInsertion);
  }
}
