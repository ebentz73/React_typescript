import React, {useContext} from 'react';
import {useStyletron} from 'baseui';
import {Link} from 'fusion-plugin-react-router';
import {assetUrl} from 'fusion-core';
import {MaybeEventContext} from './event/context';

export const Header = () => {
  const [css, theme] = useStyletron();
  const {event} = useContext(MaybeEventContext);

  const containerStyles = css({
    flex: '0 0 80px',
    display: 'flex',
    backgroundColor: event ? '#FFFFFF' : '#F3F2F2',
    alignItems: 'center',
    borderBottom: '1px solid #F3F2F2',
  });
  const logoStyles = css({
    marginLeft: theme.sizing.scale1000,
  });
  const eventNameStyles = css({
    marginLeft: theme.sizing.scale1000,
  });

  return (
    <div className={containerStyles}>
      <div className={logoStyles}>
        <Link to="/">
          <img src={assetUrl('../../static/logo.svg')} />
        </Link>
      </div>
      {event && <div className={eventNameStyles}>{event.name}</div>}
    </div>
  );
};
