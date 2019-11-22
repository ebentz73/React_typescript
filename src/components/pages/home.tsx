// @flow
import React from 'react';
import {styled} from 'baseui';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {Button} from 'baseui/button';
import {SessionQuery, SessionQueryType} from '../queries';
import {LogOutMutation} from '../mutations';

const Container = styled('div', {
  height: '100%',
  textAlign: 'center',
  backgroundColor: '#FFFFFF',
});

export const Home = () => {
  const {
    data: {session},
  } = useQuery<SessionQueryType>(SessionQuery);
  const [logout] = useMutation(LogOutMutation);

  if (!session.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <Container>
      Frosted Affair
      <Button onClick={() => logout()}>Log Out</Button>
    </Container>
  );
};
