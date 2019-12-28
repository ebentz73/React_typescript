import moment from 'moment';
import {Option} from 'baseui/select';

export interface TimeOption extends Option {
  hour: number;
  minute: number;
}

export const createTimeInputOptions = (): TimeOption[] => {
  const endOfDay = moment().endOf('day');
  const options: TimeOption[] = [];

  let time = moment().startOf('day');
  while (time <= endOfDay) {
    options.push({
      id: time.valueOf(),
      label: time.format('LT'),
      hour: time.hour(),
      minute: time.minute(),
    });
    time = moment(time).add(5, 'minutes');
  }

  return options;
};
