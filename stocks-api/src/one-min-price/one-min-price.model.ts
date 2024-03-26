import { Entity } from 'typeorm';

import { Price } from 'src/shared/models/price.model';

@Entity()
export class OneMinPrice extends Price {}
