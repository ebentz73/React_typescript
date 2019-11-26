import * as React from 'react';
import {useStyletron} from 'baseui';

export const SettingsPage = () => {
  const [css, theme] = useStyletron();

  return (
    <div>
      <div className={css({...theme.typography.font750})}>Settings</div>
    </div>
  );
};
