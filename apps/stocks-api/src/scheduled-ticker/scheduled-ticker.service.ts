import { addHours } from 'date-fns';
import { Between, In, Or, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ScheduledTicker, ScheduledTickerQueryDto } from '@app/stocks-models';

@Injectable()
export class ScheduledTickerService {
  constructor(
    @InjectRepository(ScheduledTicker)
    private scheduledTickerRepository: Repository<ScheduledTicker>,
  ) {}

  async get({
    from,
    to,
    status,
    tickerId,
  }: ScheduledTickerQueryDto): Promise<ScheduledTicker[]> {
    return this.scheduledTickerRepository.findBy({
      dateTime: Or(
        Between(from, addHours(to, 23)),
        In([from.toISOString(), to.toISOString()]),
      ),
      status,
      ticker: { id: tickerId },
    });
  }
}
