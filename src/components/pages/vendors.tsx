import * as React from 'react';
import {useFrostedStyletron} from '../util';

export const VendorsPage = () => {
  const [css, theme] = useFrostedStyletron();

  return (
    <div>
      <div className={css({...theme.titleFont})}>Vendors</div>
    </div>
  );
};
