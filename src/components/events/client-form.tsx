import React from 'react';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';
import {useStyletron} from 'baseui';
import {parsePhoneInput} from '../common/util';

export type ClientFormState = {
  name: string;
  email: string;
  phone: string;
};

interface Props {
  state: ClientFormState;
  setState: (newState: ClientFormState) => void;
  title?: string;
}

export const ClientForm = ({state, setState, title}: Props) => {
  const [css, theme] = useStyletron();
  const titleStyles = css({...theme.typography.font550});

  return (
    <div>
      <div className={titleStyles}>{title || 'Client Information'}</div>
      <FormControl label="Name" caption="">
        <Input
          value={state.name}
          onChange={(e: any) => setState({...state, name: e.target.value})}
        />
      </FormControl>
      <div className={css({display: 'flex'})}>
        <div className={css({flexGrow: 1, marginRight: theme.sizing.scale700})}>
          <FormControl label="Email" caption="">
            <Input
              value={state.email}
              onChange={(e: any) => setState({...state, email: e.target.value})}
            />
          </FormControl>
        </div>
        <div className={css({flexGrow: 1})}>
          <FormControl label="Phone" caption="">
            <div className={css({height: '48px', display: 'flex'})}>
              <Input
                value={state.phone}
                onChange={e =>
                  setState({
                    ...state,
                    phone: parsePhoneInput(state.phone, e.currentTarget.value),
                  })
                }
              />
            </div>
          </FormControl>
        </div>
      </div>
    </div>
  );
};
