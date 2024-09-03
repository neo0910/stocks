import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TickerDto {
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  marketClose?: string;

  @IsOptional()
  @IsString()
  marketOpen?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
