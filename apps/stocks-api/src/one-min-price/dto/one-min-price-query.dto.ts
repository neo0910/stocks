import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class OneMinPriceQueryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;
}
