import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/shared/models/base.model';
import { Ticker } from 'src/ticker/ticker.model';

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
