import { IsDateString } from 'class-validator';
import { TickerDto } from 'src/ticker/dto/ticker.dto';

export class DailyPriceQueryDto extends TickerDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
