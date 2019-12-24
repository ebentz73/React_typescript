import moment from 'moment';
import {Option} from 'baseui/select';

export const createTimeInputOptions = () => {
  const endOfDay = moment().endOf('day');
  const options: Option[] = [];

  let time = moment().startOf('day');
  while (time <= endOfDay) {
    options.push({
      id: time.valueOf(),
      label: time.format('LT'),
    });
    time = moment(time).add(5, 'minutes');
  }

  return options;
};
