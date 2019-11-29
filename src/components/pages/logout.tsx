// @flow
import React, {useEffect} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {SessionQuery, SessionQueryType} from '../queries';
import {LogOutMutation} from '../mutations';
import {RoutePaths} from '../../constants';

export const Logout = () => {
  const {data} = useQuery<SessionQueryType>(SessionQuery);
  const [logout] = useMutation(LogOutMutation);

  useEffect(() => {
    logout();
  }, [logout]);

  console.log('LOGOUT render: ' + (data ? data.session.isLoggedIn : false));
  if (!data) {
    return null;
  }

  return data.session.isLoggedIn ? null : <Redirect to={RoutePaths.Login()} />;
};
