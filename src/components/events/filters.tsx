import React from 'react';
import {useStyletron} from 'baseui';
import {Search} from 'baseui/icon';
import {Button, SIZE} from 'baseui/button';
import {EventFilterType} from '../../data/schema-types';
import {Input} from 'baseui/input';

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
      <div className={css({display: 'flex', alignItems: 'center'})}>
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.currentTarget.value)}
          clearable={true}
          overrides={{
            Root: {style: {width: '400px'}},
            After: {
              component: () => (
                <div
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  })}
                >
                  <Search size={32} />
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
          <span className={css({fontSize: theme.typography.font400.fontSize})}>
            New Event
          </span>
        </Button>
      </div>
    </div>
  );
};
