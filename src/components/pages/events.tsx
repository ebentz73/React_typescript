import React from 'react';
import {useStyletron} from 'baseui';
import {Search} from 'baseui/icon';
import {Button} from 'baseui/button';
import {SIZE} from 'baseui/input';

export const EventsPage = ({history}) => {
  const [css, theme] = useStyletron();

  return (
    <div className={css({margin: `0 ${theme.sizing.scale1600}`})}>
      <h1>Events</h1>
      <EventFilters
        goToNewEvent={() => history.push('/new-event')}
      ></EventFilters>
    </div>
  );
};

const EventFilters = ({goToNewEvent}) => {
  const [css, theme] = useStyletron();
  const verticalCenter = css({
    verticalAlign: 'middle',
  });

  return (
    <div className={css({display: 'flex', justifyContent: 'space-between'})}>
      <div>
        <span className={verticalCenter}>
          <Search size={32} />
        </span>
        <FilterAnchor text="recent"></FilterAnchor>
        <FilterAnchor text="all"></FilterAnchor>
        <FilterAnchor text="archived"></FilterAnchor>
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

const FilterAnchor = ({text}) => {
  const [css] = useStyletron();

  const styles = css({
    paddingLeft: '28px',
    fontSize: '18px',
    verticalAlign: 'middle',
  });

  return (
    <span className={styles}>
      <a>{text.toUpperCase()}</a>
    </span>
  );
};
