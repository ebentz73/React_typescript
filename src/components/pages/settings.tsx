import * as React from 'react';
import {useFrostedStyletron} from '../util';

export const SettingsPage = () => {
  const [css, theme] = useFrostedStyletron();

  return (
    <div>
      <div className={css({...theme.titleFont})}>Settings</div>
    </div>
  );
};
