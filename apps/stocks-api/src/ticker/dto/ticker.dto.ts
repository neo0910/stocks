import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TickerDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  marketOpen?: string;

  @IsOptional()
  @IsString()
  marketClose?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
