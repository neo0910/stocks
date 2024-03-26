import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Ticker } from 'src/ticker/ticker.model';

import { OneMinPrice } from './one-min-price.model';
import { OneMinPriceQueryDto } from './dto/one-min-price-query.dto';

@Injectable()
export class OneMinPriceService {
  constructor(
    @InjectRepository(OneMinPrice)
    private oneMinPricesRepository: Repository<OneMinPrice>,
  ) {}

  async get({ from, to, symbol }: OneMinPriceQueryDto): Promise<OneMinPrice[]> {
    return this.oneMinPricesRepository.find({
      where: {
        dateTime: Between(new Date(from), new Date(to)),
        ticker: { symbol },
      },
    });
  }

  async insert(prices: any[], ticker: Ticker): Promise<void> {
    await this.oneMinPricesRepository.save(
      prices.map((price) => ({ ...price, ticker })),
      { chunk: prices.length / 1000 },
    );
  }
}
