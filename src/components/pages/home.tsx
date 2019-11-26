// @flow
import React from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import {Search} from 'baseui/icon';
import {Button} from 'baseui/button';
import {SIZE} from 'baseui/input';
import {EventModal} from '../events/event-modal';

export const Home = () => {
  const [css, theme] = useStyletron();

  const container = css({
    height: '100%',
    backgroundColor: '#FFFFFF',
    margin: `${theme.sizing.scale700} ${theme.sizing.scale1600}`,
  });

  const {
    data: {session},
  } = useQuery<SessionQueryType>(SessionQuery);

  if (!session.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={container}>
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

  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
  function closeEventModal() {
    setIsEventModalOpen(false);
  }

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
          close={closeEventModal}
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
