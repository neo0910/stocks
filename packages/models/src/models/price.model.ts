import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ONE_MINUTE_IN_MS } from '../constants';

import { Base } from './base.model';
import { Ticker } from './ticker.model';

@Entity()
export class Price extends Base {
  @ManyToOne(() => Ticker, { eager: true })
  @JoinColumn()
  ticker: Ticker;

  @Column('numeric')
  open: number;

  @Column('numeric')
  high: number;

  @Column('numeric')
  low: number;

  @Column('numeric')
  close: number;

  @Column()
  volume: number;

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
