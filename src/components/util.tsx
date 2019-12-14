import React from 'react';
import {styled, createThemedUseStyletron} from 'baseui';
import {Link} from 'fusion-plugin-react-router';
import {Theme} from 'baseui/theme';
import {Spinner} from 'baseui/spinner';

export const useFrostedStyletron = createThemedUseStyletron<FrostedTheme>();

export const StyledRouterLink = styled(Link, {
  color: 'unset',
  textDecoration: 'unset',
  ':hover': {
    textDecoration: 'underline',
  },
});

export const LoadingSpinner = () => {
  const [, theme] = useFrostedStyletron();
  return (
    <Spinner
      size="140px"
      overrides={{
        ActivePath: {
          style: {fill: theme.colors.primary},
        },
      }}
    />
  );
};

interface Font {
  fontFamily: string;
  fontWeight:
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
    | 'bold'
    | 'normal'
    | 'bolder'
    | 'lighter'
    | number;
  fontSize: string;
  lineHeight: string | number;
}

interface FrostedTheme extends Theme {
  titleFont: Font;
  eventTitleFont: Font;
  eventDateFont: Font;
  eventTotalBudgetFont: Font;
  fonts: {
    tableHeader: Font;
    tableContents: Font;
  };
}
