import React, {useContext, useState} from 'react';
import {Button, KIND, SIZE} from 'baseui/button';
import {RoutePaths} from '../../constants';
import {useFrostedStyletron} from '../util';
import {EventsContext} from '../events/context';
import {COUNTRIES} from 'baseui/phone-input';
import {ClientFormState} from '../events/client-form';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';
import {Datepicker} from 'baseui/datepicker';
import {ClientForm} from '../events/client-form';
import {StyledLink} from 'baseui/link';
import moment from 'moment';
import {unwrap} from '../../util';
import {assetUrl} from 'fusion-core';

export const NewEventPage = ({history}) => {
  const [css, theme] = useFrostedStyletron();

  const formStyles = css({
    width: '560px',
    marginLeft: 'auto',
    marginRight: 'auto',
  });
  const formWrapperStyles = css({
    flexGrow: 1,
  });
  const footerStyles = css({
    backgroundColor: '#FFFFFF',
    width: '100%',
    flex: '0 0 72px',
    boxShadow: '1px 0 4px 0 #F1F4F7',
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.sizing.scale1000,
  });
  const buttonSectionStyles = css({
    width: '350px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });
  const buttonStyles = {
    width: '160px',
    ...theme.typography.font300,
  };

  const panelStyles = css({
    background: '#FFFFFF',
    padding: `${theme.sizing.scale800} ${theme.sizing.scale1000}`,
    marginBottom: theme.sizing.scale800,
  });
  const titleStyles = css({...theme.typography.font550});

  const {
    state: {createEventLoading},
    actions: {createEvent},
  } = useContext(EventsContext);

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
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

  return (
    <>
      <div className={formWrapperStyles}>
        <div className={formStyles}>
          <div className={css({...theme.titleFont})}>Create event</div>
          <div className={css({...theme.typography.font300})}>
            Enter event details and important information
          </div>
          <div className={css({marginTop: theme.sizing.scale900})}>
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
                    className={css({
                      marginRight: theme.sizing.scale700,
                      flexGrow: 1,
                    })}
                  >
                    <FormControl label="Date" caption="">
                      <Datepicker
                        value={eventDate}
                        onDayClick={({date}) => setEventDate(date)}
                        formatDisplayValue={(date: Date) =>
                          moment(date).format('D MMM YY')
                        }
                        overrides={{
                          Input: {
                            props: {
                              overrides: {
                                Before: () => (
                                  <img
                                    height="24px"
                                    width="24px"
                                    className={css({
                                      marginTop: '10px',
                                      marginLeft: '8px',
                                    })}
                                    src={assetUrl(
                                      '../../static/calendar_icon.svg'
                                    )}
                                  />
                                ),
                                Input: {
                                  props: {
                                    readonly: 'readonly',
                                  },
                                },
                              },
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className={css({flexGrow: 1})}>
                    <FormControl label="Budget" caption="">
                      <Input
                        value={eventBudget}
                        onChange={(e: any) => setEventBudget(e.target.value)}
                        type="number"
                        startEnhancer="$"
                        endEnhancer=".00"
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
                  setClientFormStates(
                    clientFormStates.concat(defaultClientFormState)
                  )
                }
              >
                <span className={css({cursor: 'pointer'})}>
                  + Additional client information
                </span>
              </StyledLink>
            </div>
          </div>
        </div>
      </div>
      <div className={footerStyles}>
        <div className={buttonSectionStyles}>
          <Button
            size={SIZE.compact}
            $style={buttonStyles}
            isLoading={createEventLoading}
            onClick={async () => {
              await createEvent({
                name: eventName,
                date: eventDate.valueOf(),
                budget: parseInt(eventBudget, 10),
                clients: clientFormStates.map(f => ({
                  name: f.name,
                  email: f.email,
                  phone: f.country.dialCode + f.phone,
                })),
              });
              history.push(RoutePaths.Events());
            }}
          >
            Save Changes
          </Button>
          <Button
            size={SIZE.compact}
            $style={buttonStyles}
            kind={KIND.tertiary}
            onClick={() => history.push(RoutePaths.Events())}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};
