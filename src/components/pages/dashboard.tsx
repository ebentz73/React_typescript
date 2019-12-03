import * as React from 'react';
import {useFrostedStyletron} from '../util';

export const DashboardPage = () => {
  const [css, theme] = useFrostedStyletron();

  return (
    <div>
      <div className={css({...theme.titleFont})}>Dashboard</div>
    </div>
  );
};
