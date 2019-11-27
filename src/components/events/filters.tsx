import React from 'react';
import {useStyletron} from 'baseui';
import {Search} from 'baseui/icon';
import {Button, SIZE} from 'baseui/button';
import {EventFilterType} from '../../data/schema-types';

interface Props {
  goToNewEvent: () => void;
  selectedFilterType: EventFilterType;
  setSelectedFilterType: (filterType: EventFilterType) => void;
}

export const EventFilters = ({
  goToNewEvent,
  selectedFilterType,
  setSelectedFilterType,
}: Props) => {
  const [css, theme] = useStyletron();
  const verticalCenter = css({
    verticalAlign: 'middle',
  });
  const commonAnchorStles = {
    marginLeft: '28px',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };
  const filterAnchorStyles = css(commonAnchorStles);
  const selectedFilterAnchorStyles = css({
    ...commonAnchorStles,
    borderBottom: `4px solid ${theme.colors.primary}`,
  });

  return (
    <div className={css({display: 'flex', justifyContent: 'space-between'})}>
      <div>
        <span className={verticalCenter}>
          <Search size={32} />
        </span>
        {Object.keys(EventFilterType).map(f => {
          const filterType = EventFilterType[f];
          return (
            <span
              key={filterType}
              className={
                filterType === selectedFilterType
                  ? selectedFilterAnchorStyles
                  : filterAnchorStyles
              }
              onClick={() => setSelectedFilterType(filterType)}
            >
              <a>{filterType}</a>
            </span>
          );
        })}
      </div>
      <div>
        <Button onClick={goToNewEvent} size={SIZE.compact}>
          <span className={css({fontSize: theme.typography.font400.fontSize})}>
            New Event
          </span>
        </Button>
      </div>
    </div>
  );
};
