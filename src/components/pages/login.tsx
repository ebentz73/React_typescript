// @flow
import React, {useState} from 'react';
import {Input} from 'baseui/input';
import {Button, KIND} from 'baseui/button';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Redirect} from 'fusion-plugin-react-router';
import {useStyletron} from 'baseui';
import {SignupUserMutation, LoginUserMutation} from '../mutations';
import {SessionQuery, SessionQueryType} from '../queries';
import {FormControl} from 'baseui/form-control';
import {RoutePaths} from '../../constants';

export const Login = () => {
  const [css, theme] = useStyletron();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signup, {loading: signupLoading}] = useMutation(SignupUserMutation, {
    variables: {email, password},
  });
  const [login, {loading: loginLoading}] = useMutation(LoginUserMutation, {
    variables: {email, password},
  });

  const {data} = useQuery<SessionQueryType>(SessionQuery);

  if (!data) {
    return null;
  }

  const session = data.session;
  if (session.isLoggedIn) {
    return <Redirect to={RoutePaths.Events()} />;
  }

  const containerStyle = css({
    height: '100%',
    width: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.sizing.scale1200,
    backgroundColor: '#FFFFFF',
  });

  const titleStyle = css({
    ...theme.typography.font650,
    textAlign: 'center',
    marginBottom: theme.sizing.scale800,
  });

  const errorStyle = css({
    marginBottom: theme.sizing.scale400,
    color: theme.colors.negative,
    ...theme.typography.font250,
  });

  const buttonStyle = {
    width: theme.sizing.scale4800,
    marginLeft: theme.sizing.scale400,
  };

  return (
    <div className={containerStyle}>
      <div className={titleStyle}>Log in</div>
      <FormControl label="Email">
        <Input value={email} onChange={(e: any) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl label="Password">
        <Input
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          type="password"
          onKeyPress={e => {
            if (e.key === 'Enter') {
              login();
            }
          }}
        />
      </FormControl>
      {session.error && <div className={errorStyle}>{session.error}</div>}
      <div className={css({display: 'flex', justifyContent: 'flex-end'})}>
        <Button
          kind={KIND.secondary}
          onClick={() => signup()}
          isLoading={signupLoading}
          $style={buttonStyle}
        >
          Sign Up
        </Button>
        <Button
          onClick={() => login()}
          isLoading={loginLoading}
          $style={buttonStyle}
        >
          Login
        </Button>
      </div>
    </div>
  );
};
