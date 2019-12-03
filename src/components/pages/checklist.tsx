import * as React from 'react';
import {useFrostedStyletron} from '../util';

export const ChecklistPage = () => {
  const [css, theme] = useFrostedStyletron();

  return (
    <div>
      <div className={css({...theme.titleFont})}>Checklist</div>
    </div>
  );
};
