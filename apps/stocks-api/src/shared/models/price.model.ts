import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Ticker } from '../../ticker/ticker.model';

import { Base } from './base.model';

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

  @Column()
  dateTime: Date;
}
