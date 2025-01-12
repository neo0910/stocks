import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ONE_MINUTE_IN_MS } from '../constants';

import { Base } from './base.model';
import { Ticker } from './ticker.model';

export enum ScheduledStatus {
  DONE = 'done',
  ERROR = 'error',
  INCOMPLETED = 'incompleted',
  NODATA = 'nodata',
  READY = 'ready',
}

@Entity()
export class ScheduledTicker extends Base {
  @ManyToOne(() => Ticker, { eager: true })
  @JoinColumn()
  ticker: Ticker;

  @Column({
    type: 'enum',
    enum: ScheduledStatus,
    default: ScheduledStatus.READY,
  })
  status: ScheduledStatus;

  @Column({
    type: 'timestamp',
    transformer: {
      from: (value: Date) => {
        const tzOffset = value.getTimezoneOffset() * ONE_MINUTE_IN_MS;
        return new Date(value.getTime() - tzOffset);
      },
      to: (value: string) => value,
    },
  })
  @Index()
  dateTime: Date;
}
