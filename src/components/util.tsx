import React from 'react';
import {styled, createThemedUseStyletron} from 'baseui';
import {Link} from 'fusion-plugin-react-router';
import {Theme} from 'baseui/theme';
import {Spinner} from 'baseui/spinner';
import {withStyle} from 'styletron-react';
import {StyledTable} from 'baseui/table-grid';

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

export interface FrostedTheme extends Theme {
  titleFont: Font;
  eventTitleFont: Font;
  eventDateFont: Font;
  eventTotalBudgetFont: Font;
  fonts: {
    tableHeader: Font;
    tableContents: Font;
  };
}

export const getTableStyles = (theme: FrostedTheme) => ({
  header: {
    ...theme.fonts.tableHeader,
    color: '#B0AFAF',
    backgroundColor: theme.colors.tableHeadBackgroundColor,
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.sizing.scale500,
    paddingRight: theme.sizing.scale600,
    paddingBottom: theme.sizing.scale500,
    paddingLeft: theme.sizing.scale600,
  },
  cell: {
    ...theme.fonts.tableContents,
    color: '#0B0C0E',
    paddingTop: theme.sizing.scale300,
    paddingRight: theme.sizing.scale600,
    paddingBottom: theme.sizing.scale300,
    paddingLeft: theme.sizing.scale600,
    display: 'flex',
    alignItems: 'center',
    height: '72px',
    overflow: 'hidden',
  },
});

export const BorderlessTable = withStyle(StyledTable, {
  borderLeft: 'none',
  borderRight: 'none',
  borderTop: 'none',
  borderBottom: 'none',
});
