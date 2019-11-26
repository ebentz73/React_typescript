import * as React from 'react';
import {useStyletron} from 'baseui';
import {EventForm} from '../events/event-form';
import {Button, KIND, SIZE} from 'baseui/button';

export const NewEventPage = ({history}) => {
  const [css, theme] = useStyletron();

  const formStyles = css({
    width: '560px',
    marginLeft: 'auto',
    marginRight: 'auto',
  });
  const formWrapperStyles = css({
    flexGrow: 1,
    overflowY: 'scroll',
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

  return (
    <>
      <div className={formWrapperStyles}>
        <div className={formStyles}>
          <div className={css({...theme.typography.font750})}>Create event</div>
          <div className={css({...theme.typography.font300})}>
            Enter event details and important information
          </div>
          <div className={css({marginTop: theme.sizing.scale900})}>
            <EventForm />
          </div>
        </div>
      </div>
      <div className={footerStyles}>
        <div className={buttonSectionStyles}>
          <Button size={SIZE.compact} $style={buttonStyles}>
            Save Changes
          </Button>
          <Button
            size={SIZE.compact}
            $style={buttonStyles}
            kind={KIND.tertiary}
            onClick={() => history.push('/')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};
