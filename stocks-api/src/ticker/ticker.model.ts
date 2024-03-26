import { Entity, Column } from 'typeorm';

import { Base } from 'src/shared/models/base.model';

@Entity()
export class Ticker extends Base {
  @Column({ unique: true })
  symbol: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  region: string;

  @Column()
  marketOpen: string;

  @Column()
  marketClose: string;

  @Column()
  timezone: string;

  @Column()
  currency: string;
}
