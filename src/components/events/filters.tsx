import React from 'react';
import {useStyletron} from 'baseui';
import {Search} from 'baseui/icon';
import {Button, SIZE} from 'baseui/button';
import {EventFilterType} from '../../data/schema-types';
import {Input, SIZE as INPUT_SIZE} from 'baseui/input';

interface Props {
  goToNewEvent: () => void;
  selectedFilterType: EventFilterType;
  setSelectedFilterType: (filterType: EventFilterType) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

export const EventFilters = ({
  goToNewEvent,
  selectedFilterType,
  setSelectedFilterType,
  searchQuery,
  setSearchQuery,
}: Props) => {
  const [css, theme] = useStyletron();
  const commonAnchorStles = {
    ...theme.typography.font100,
    marginLeft: '28px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    color: '#0B0C0E',
  };
  const filterAnchorStyles = css(commonAnchorStles);
  const selectedFilterAnchorStyles = css({
    ...commonAnchorStles,
    borderBottom: `2px solid ${theme.colors.primary}`,
  });

  return (
    <div className={css({display: 'flex', justifyContent: 'space-between'})}>
      <div className={css({display: 'flex', alignItems: 'center'})}>
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.currentTarget.value)}
          placeholder="Search..."
          clearable={true}
          size={INPUT_SIZE.compact}
          overrides={{
            Root: {style: {width: '400px'}},
            Before: {
              component: () => (
                <div
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  })}
                >
                  <Search size={24} />
                </div>
              ),
            },
          }}
        />
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
          <span className={css({...theme.typography.font200})}>New Event</span>
        </Button>
      </div>
    </div>
  );
};
