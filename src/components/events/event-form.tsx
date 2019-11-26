import React, {useState} from 'react';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';
import {Datepicker} from 'baseui/datepicker';
import {ClientForm} from './client-form';
import {StyledLink} from 'baseui/link';
import {ClientFormState} from './client-form';

export const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState([]);
  const [eventBudget, setEventBudget] = useState('');

  const defaultClientFormState = {
    name: '',
    email: '',
    phone: '',
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

  return (
    <div>
      <FormControl label={() => 'Event Name'} caption={() => ''}>
        <Input
          value={eventName}
          onChange={(e: any) => setEventName(e.target.value)}
        />
      </FormControl>
      <FormControl label={() => 'Date'} caption={() => ''}>
        <Datepicker
          value={eventDate}
          onChange={({date}) =>
            setEventDate(Array.isArray(date) ? date : [date])
          }
        />
      </FormControl>
      <FormControl label={() => 'Budget'} caption={() => ''}>
        <Input
          value={eventBudget}
          onChange={(e: any) => setEventBudget(e.target.value)}
        />
      </FormControl>

      {clientFormStates.map((value, index) => {
        return (
          <ClientForm
            key={index}
            state={value}
            setState={newState => updateFormState(newState, index)}
          ></ClientForm>
        );
      })}
      <StyledLink
        onClick={() =>
          setClientFormStates(clientFormStates.concat(defaultClientFormState))
        }
      >
        + Additional client information
      </StyledLink>
    </div>
  );
};
