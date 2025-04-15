import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Ticker, TickerDto } from '@stocks/models';

@Injectable()
export class TickerCollectorService {
  constructor(
    @InjectRepository(Ticker)
    private tickersRepository: Repository<Ticker>
  ) {}

  async findBySymbol(symbol: string): Promise<Ticker | null> {
    return this.tickersRepository.findOneBy({ symbol: ILike(symbol) });
  }

  async createBulk(dtos: TickerDto[]): Promise<void> {
    await this.tickersRepository
      .createQueryBuilder()
      .insert()
      .into(Ticker)
      .values(dtos)
      .orIgnore()
      .execute();
  }
}
