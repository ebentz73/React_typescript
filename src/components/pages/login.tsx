// @flow
import React, {useState} from 'react';
import {Block} from 'baseui/block';
import {Input} from 'baseui/input';
import {Button} from 'baseui/button';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {styled} from 'baseui';
import {SignupUserMutation, LoginUserMutation} from '../mutations';
import {SessionQuery, SessionQueryType} from '../queries';

const Container = styled('div', ({$theme: {sizing: {scale1200}}}) => ({
  height: '100%',
  width: '500px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: scale1200,
  backgroundColor: '#FFFFFF',
}));

const Title = styled(
  'div',
  ({
    $theme: {
      sizing: {scale800},
      typography: {font650},
    },
  }) => ({
    ...font650,
    textAlign: 'center',
    marginBottom: scale800,
  })
);

const StyledButton = styled(Button, ({$theme: {sizing: {scale4800}}}) => ({
  width: scale4800,
}));

const Label = styled('div', ({$theme: {colors: {primary500}}}) => ({
  color: primary500,
}));

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signup, {loading: signupLoading}] = useMutation(SignupUserMutation, {
    variables: {email, password},
  });
  const [login, {loading: loginLoading}] = useMutation(LoginUserMutation, {
    variables: {email, password},
  });

  const {
    data: {session},
  } = useQuery<SessionQueryType>(SessionQuery);
  if (session.isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Title>Log in</Title>
      <Block marginBottom="scale400">
        <Label>Email</Label>
        <Input value={email} onChange={(e: any) => setEmail(e.target.value)} />
      </Block>
      <Block marginBottom="scale400">
        <Label>Password</Label>
        <Input
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          type="password"
        />
      </Block>
      {session.error && (
        <Block marginBottom="scale400" color="negative">
          {session.error}
        </Block>
      )}
      <Block display="flex" justifyContent="flex-end">
        <StyledButton onClick={() => signup()} isLoading={signupLoading}>
          Sign Up
        </StyledButton>
        <StyledButton onClick={() => login()} isLoading={loginLoading}>
          Login
        </StyledButton>
      </Block>
    </Container>
  );
};
