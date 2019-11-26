import React, {useState} from 'react';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';
import {Datepicker} from 'baseui/datepicker';
import {ClientForm} from './client-form';
import {StyledLink} from 'baseui/link';
import {ClientFormState} from './client-form';
import {useStyletron} from 'baseui';
import {COUNTRIES} from 'baseui/phone-input';

export const EventForm = () => {
  const [css, theme] = useStyletron();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState();
  const [eventBudget, setEventBudget] = useState('');

  const defaultClientFormState = {
    name: '',
    email: '',
    phone: '',
    country: COUNTRIES.US,
  };
  const [clientFormStates, setClientFormStates] = useState<ClientFormState[]>([
    defaultClientFormState,
  ]);

  function updateFormState(newState: ClientFormState, updatedIndex) {
    setClientFormStates(
      clientFormStates.map((oldState, i) =>
        i === updatedIndex ? newState : oldState
      )
    );
  }

  const panelStyles = css({
    background: '#FFFFFF',
    padding: `${theme.sizing.scale800} ${theme.sizing.scale1000}`,
    marginBottom: theme.sizing.scale800,
  });
  const titleStyles = css({...theme.typography.font550});

  return (
    <div>
      <div className={panelStyles}>
        <div className={titleStyles}>Basic Information</div>
        <FormControl label="Event Name" caption="">
          <Input
            value={eventName}
            onChange={(e: any) => setEventName(e.target.value)}
          />
        </FormControl>
        <div className={css({display: 'flex'})}>
          <div
            className={css({marginRight: theme.sizing.scale700, flexGrow: 1})}
          >
            <FormControl label="Date" caption="">
              <Datepicker
                value={eventDate}
                onChange={({date}) => setEventDate(date)}
              />
            </FormControl>
          </div>
          <div className={css({flexGrow: 1})}>
            <FormControl label="Budget" caption="">
              <Input
                value={eventBudget}
                onChange={(e: any) => setEventBudget(e.target.value)}
              />
            </FormControl>
          </div>
        </div>
      </div>
      {clientFormStates.map((value, index) => {
        return (
          <div key={index} className={panelStyles}>
            <ClientForm
              state={value}
              setState={newState => updateFormState(newState, index)}
            ></ClientForm>
          </div>
        );
      })}
      <StyledLink
        onClick={() =>
          setClientFormStates(clientFormStates.concat(defaultClientFormState))
        }
      >
        <span className={css({cursor: 'pointer'})}>
          + Additional client information
        </span>
      </StyledLink>
    </div>
  );
};
