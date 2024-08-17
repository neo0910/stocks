import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { DailyPrice } from '@app/stocks-models';
import { Ticker } from '@app/stocks-models';

import { DailyPriceQueryDto } from './dto/daily-price-query.dto';

@Injectable()
export class DailyPriceService {
  constructor(
    @InjectRepository(DailyPrice)
    private dailyPricesRepository: Repository<DailyPrice>,
  ) {}

  async get({ from, to, symbol }: DailyPriceQueryDto): Promise<DailyPrice[]> {
    return this.dailyPricesRepository.find({
      where: {
        dateTime: Between(new Date(from), new Date(to)),
        ticker: { symbol },
      },
    });
  }

  async insert(prices: any[], ticker: Ticker): Promise<void> {
    await this.dailyPricesRepository.insert(
      prices.map((price) => ({ ...price, ticker })),
    );
  }
}
