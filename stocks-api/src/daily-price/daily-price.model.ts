import { Entity } from 'typeorm';

import { Price } from 'src/shared/models/price.model';

@Entity()
export class DailyPrice extends Price {}
