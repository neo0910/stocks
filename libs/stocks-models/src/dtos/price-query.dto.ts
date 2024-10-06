import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class PriceQueryDto {
  @IsDate()
  @IsNotEmpty()
  from: Date;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsDate()
  @IsNotEmpty()
  to: Date;
}
