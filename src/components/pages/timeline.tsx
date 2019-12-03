import * as React from 'react';
import {useFrostedStyletron} from '../util';

export const TimelinePage = () => {
  const [css, theme] = useFrostedStyletron();

  return (
    <div>
      <div className={css({...theme.titleFont})}>Timeline</div>
    </div>
  );
};
