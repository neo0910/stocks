import { Module } from '@nestjs/common';
import { StocksModelsService } from './stocks-models.service';

@Module({
  providers: [StocksModelsService],
  exports: [StocksModelsService],
})
export class StocksModelsModule {}
