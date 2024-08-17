import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticker } from '@app/stocks-models';

import { TickerDto } from './dto/ticker.dto';

@Injectable()
export class TickerService {
  constructor(
    @InjectRepository(Ticker)
    private tickersRepository: Repository<Ticker>,
  ) {}

  async findBySymbol(symbol: string): Promise<Ticker> {
    return this.tickersRepository.findOneBy({ symbol });
  }

  async findById(id: number): Promise<Ticker> {
    return this.tickersRepository.findOneBy({ id });
  }

  async create(dto: TickerDto): Promise<Ticker> {
    return this.tickersRepository.create(dto).save();
  }

  async remove(id: number): Promise<void> {
    await this.tickersRepository.delete(id);
  }
}
