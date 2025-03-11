import { isSameMonth } from 'date-fns';

import { ScheduledTicker } from '../models/scheduled-ticker.model';

export const filterOutExistedMonth =
  (existedMonths: ScheduledTicker[]) => (month: Date) => {
    if (!existedMonths.length) return true;

    return !existedMonths.some(({ dateTime }) => isSameMonth(dateTime, month));
  };
