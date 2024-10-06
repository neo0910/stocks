import { Entity } from 'typeorm';

import { Price } from './price.model';

@Entity()
export class OneHourPrice extends Price {}
