import React from 'react';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';
import {useStyletron} from 'baseui';
import {PhoneInput, Country, COUNTRIES} from 'baseui/phone-input';

export type ClientFormState = {
  name: string;
  email: string;
  phone: string;
  country: Country;
};

interface Props {
  state: ClientFormState;
  setState: (newState: ClientFormState) => void;
}

export const ClientForm = ({state, setState}: Props) => {
  const [css, theme] = useStyletron();
  const titleStyles = css({...theme.typography.font550});

  return (
    <div>
      <div className={titleStyles}>Client Information</div>
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
              <PhoneInput
                overrides={{Input: {style: {height: '48px'}}}}
                country={state.country}
                onCountryChange={({option}) =>
                  setState({...state, country: COUNTRIES[option.id]})
                }
                text={state.phone}
                onTextChange={e =>
                  setState({...state, phone: e.currentTarget.value})
                }
              />
            </div>
          </FormControl>
        </div>
      </div>
    </div>
  );
};
