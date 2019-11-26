import React from 'react';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';

export type ClientFormState = {
  name: string;
  email: string;
  phone: string;
};

interface Props {
  key: number;
  state: ClientFormState;
  setState: (newState: ClientFormState) => void;
}

export const ClientForm = ({state, setState}: Props) => {
  return (
    <div>
      <h3>Client Information</h3>
      <FormControl label={() => 'Name'} caption={() => ''}>
        <Input
          value={state.name}
          onChange={(e: any) => setState({...state, name: e.target.value})}
        />
      </FormControl>
      <FormControl label={() => 'Email'} caption={() => ''}>
        <Input
          value={state.email}
          onChange={(e: any) => setState({...state, email: e.target.value})}
        />
      </FormControl>
      <FormControl label={() => 'Phone'} caption={() => ''}>
        <Input
          value={state.phone}
          onChange={(e: any) => setState({...state, phone: e.target.value})}
        />
      </FormControl>
    </div>
  );
};
