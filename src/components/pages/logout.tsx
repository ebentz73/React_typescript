// @flow
import React from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import {LogOutMutation} from '../mutations';

export const Logout = () => {
  const {
    data: {session},
  } = useQuery<SessionQueryType>(SessionQuery);
  const [logout] = useMutation(LogOutMutation);

  if (session.isLoggedIn) {
    logout();
  }
  return <Redirect to="/login" />;
};
