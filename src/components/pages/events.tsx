import React, {useState} from 'react';
import {useStyletron} from 'baseui';
import {Search} from 'baseui/icon';
import {Button} from 'baseui/button';
import {SIZE} from 'baseui/input';
import {EventModal} from '../events/event-modal';

export const EventsPage = () => {
  const [css, theme] = useStyletron();

  return (
    <div className={css({margin: `0 ${theme.sizing.scale1600}`})}>
      <h1>Events</h1>
      <EventFilters></EventFilters>
    </div>
  );
};

const EventFilters = () => {
  const [css, theme] = useStyletron();
  const verticalCenter = css({
    verticalAlign: 'middle',
  });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  return (
    <div className={css({display: 'flex'})}>
      <div>
        <span className={verticalCenter}>
          <Search size={32} />
        </span>
        <FilterAnchor text="recent"></FilterAnchor>
        <FilterAnchor text="all"></FilterAnchor>
        <FilterAnchor text="archived"></FilterAnchor>
      </div>
      <div className={css({marginLeft: 'auto'})}>
        <Button onClick={() => setIsEventModalOpen(true)} size={SIZE.compact}>
          <span className={css({fontSize: theme.typography.font400.fontSize})}>
            New Event
          </span>
        </Button>

        <EventModal
          isOpen={isEventModalOpen}
          close={() => setIsEventModalOpen(false)}
        ></EventModal>
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
