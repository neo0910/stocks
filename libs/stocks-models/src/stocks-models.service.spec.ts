import { Test, TestingModule } from '@nestjs/testing';
import { StocksModelsService } from './stocks-models.service';

describe('StocksModelsService', () => {
  let service: StocksModelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StocksModelsService],
    }).compile();

    service = module.get<StocksModelsService>(StocksModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
