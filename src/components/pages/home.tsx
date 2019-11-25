// @flow
import React from 'react';
import {useStyletron} from 'baseui';
import {useQuery} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';

export const Home = () => {
  
  const [useCss, theme] = useStyletron();
  
  const container = useCss({
    height: '100%',
    backgroundColor: '#FFFFFF',
    width: '1280px',
    margin: '0 auto'
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
    </div>
  );
};
