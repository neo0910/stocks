import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticker, TickerDto } from '@app/stocks-models';

@Injectable()
export class TickerCollectorService {
  constructor(
    @InjectRepository(Ticker)
    private tickersRepository: Repository<Ticker>,
  ) {}

  async findBySymbol(symbol: string): Promise<Ticker | null> {
    return this.tickersRepository.findOneBy({ symbol });
  }

  async createBulk(dtos: TickerDto[]): Promise<void> {
    await this.tickersRepository.upsert(dtos, {
      conflictPaths: ['symbol'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
