import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ScheduledStatus } from '../models/scheduled-ticker.model';

export class ScheduledTickerQueryDto {
  @IsDate()
  @IsNotEmpty()
  from: Date;

  @IsEnum(ScheduledStatus)
  @IsNotEmpty()
  status: ScheduledStatus;

  @IsString()
  @IsNotEmpty()
  tickerId: string;

  @IsDate()
  @IsNotEmpty()
  to: Date;
}
