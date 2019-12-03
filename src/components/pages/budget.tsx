import * as React from 'react';
import {useFrostedStyletron} from '../util';

export const BudgetPage = () => {
  const [css, theme] = useFrostedStyletron();

  return (
    <div>
      <div className={css({...theme.titleFont})}>Budget</div>
    </div>
  );
};
