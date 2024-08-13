import { Entity } from 'typeorm';

import { Price } from '../shared/models/price.model';

@Entity()
export class OneMinPrice extends Price {}
