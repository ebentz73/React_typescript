import React, {Ref} from 'react';
import {Datepicker} from 'baseui/datepicker';
import moment from 'moment';
import {assetUrl} from 'fusion-core';
import {useFrostedStyletron, LoadingSpinner} from '../../util';

export const DateInput = ({
  value,
  onValueChanged,
  isLoading,
  datepickerRef,
  onClose,
}: {
  value: Date;
  onValueChanged: (date: Date) => void;
  isLoading?: boolean;
  datepickerRef?: Ref<Datepicker>;
  onClose?: () => void;
}) => {
  const [css] = useFrostedStyletron();

  return (
    <Datepicker
      ref={datepickerRef}
      value={value}
      onDayClick={({date}) => onValueChanged(date)}
      formatDisplayValue={(date: Date) => moment(date).format('D MMM YY')}
      onClose={onClose}
      overrides={{
        Input: {
          props: {
            overrides: {
              After: () => (isLoading ? <LoadingSpinner size="40px" /> : null),
              Before: () => (
                <img
                  height="24px"
                  width="24px"
                  className={css({
                    marginTop: '10px',
                    marginLeft: '8px',
                  })}
                  src={assetUrl('../../../static/calendar_icon.svg')}
                />
              ),
              Input: {
                props: {
                  readonly: 'readonly',
                },
              },
            },
          },
        },
      }}
    />
  );
};
