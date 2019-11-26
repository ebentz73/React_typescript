// @flow
import React from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import {Search} from 'baseui/icon';
import {Button} from 'baseui/button';
import {SIZE} from 'baseui/input';

export const Home = () => {
  const [useCss, theme] = useStyletron();

  const container = useCss({
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
  const [useCss, theme] = useStyletron();
  const verticalCenter = useCss({
    verticalAlign: 'middle',
  });

  return (
    <div className={useCss({display: 'flex'})}>
      <div>
        <span className={verticalCenter}>
          <Search size={32} />
        </span>
        <FilterAnchor text="recent"></FilterAnchor>
        <FilterAnchor text="all"></FilterAnchor>
        <FilterAnchor text="archived"></FilterAnchor>
      </div>
      <div className={useCss({marginLeft: 'auto'})}>
        <Button size={SIZE.compact}>
          <span
            className={useCss({fontSize: theme.typography.font400.fontSize})}
          >
            +
          </span>
        </Button>
      </div>
    </div>
  );
};

const FilterAnchor = ({text}) => {
  const [useCss] = useStyletron();

  const styles = useCss({
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
