import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class DailyPriceQueryDto {
  @IsDateString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsDateString()
  @IsNotEmpty()
  to: string;
}
