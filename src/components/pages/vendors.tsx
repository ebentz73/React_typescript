import * as React from 'react';
import {useStyletron} from 'baseui';

export const VendorsPage = () => {
  const [css, theme] = useStyletron();

  return (
    <div>
      <div className={css({...theme.typography.font750})}>Vendors</div>
    </div>
  );
};
