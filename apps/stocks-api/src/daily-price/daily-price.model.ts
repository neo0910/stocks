import { Entity } from 'typeorm';

import { Price } from '../shared/models/price.model';

@Entity()
export class DailyPrice extends Price {}
