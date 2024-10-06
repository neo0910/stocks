import { ClientKafka } from '@nestjs/microservices';
import { ILike, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';

import { Ticker, TickerDto, TICKERS_SEARCH_TOPIC } from '@app/stocks-models';

@Injectable()
export class TickerService {
  constructor(
    @InjectRepository(Ticker)
    private tickersRepository: Repository<Ticker>,
    @Inject('TICKER_COLLECTOR_CLIENT')
    private readonly tickerCollectorClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.tickerCollectorClient.subscribeToResponseOf(TICKERS_SEARCH_TOPIC);

    await this.tickerCollectorClient.connect();
  }

  async findByKeywords(
    keywords: string,
  ): Promise<Ticker[] | Observable<TickerDto[]>> {
    const result = await this.tickersRepository.find({
      where: [
        { symbol: ILike(`${keywords}%`) },
        { name: ILike(`%${keywords}%`) },
      ],
    });

    if (result.length) {
      return result;
    }

    return this.tickerCollectorClient.send<TickerDto[], { keywords: string }>(
      TICKERS_SEARCH_TOPIC,
      { keywords },
    );
  }

  async findBySymbol(symbol: string): Promise<Ticker> {
    return this.tickersRepository.findOneBy({ symbol: ILike(symbol) });
  }

  async findById(id: string): Promise<Ticker> {
    return this.tickersRepository.findOneBy({ id });
  }

  async create(dto: TickerDto): Promise<Ticker> {
    return this.tickersRepository.create(dto).save();
  }

  async remove(id: string): Promise<void> {
    await this.tickersRepository.delete(id);
  }
}
