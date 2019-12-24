/* global Intl */

import React, {ReactNode, useRef, useEffect} from 'react';
import {styled, createThemedUseStyletron} from 'baseui';
import {Link} from 'fusion-plugin-react-router';
import {Theme} from 'baseui/theme';
import {Spinner} from 'baseui/spinner';
import {withStyle} from 'styletron-react';
import {StyledTable} from 'baseui/table-grid';
import {Button, KIND, SIZE} from 'baseui/button';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {StatefulMenu} from 'baseui/menu';
import {Overflow} from 'baseui/icon';

export const useFrostedStyletron = createThemedUseStyletron<FrostedTheme>();

export const StyledRouterLink = styled(Link, {
  color: 'unset',
  textDecoration: 'unset',
  ':hover': {
    textDecoration: 'underline',
  },
});

export const LoadingSpinner = ({size}: {size?: string}) => {
  const [, theme] = useFrostedStyletron();
  return (
    <Spinner
      size={size || '140px'}
      overrides={{
        ActivePath: {
          style: {fill: theme.colors.primary},
        },
      }}
    />
  );
};

export const useLatestValue = (value: any) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export const useMounted = () => {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);
  return ref;
};

export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
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

export const MoreOptionsButton = ({
  children,
  menuItems,
  onItemSelect,
}: {
  children?: ReactNode;
  menuItems: any;
  onItemSelect: (item: any) => void;
}) => {
  const renderMenu = close => (
    <StatefulMenu
      items={menuItems}
      overrides={{
        List: {
          style: {
            backgroundColor: '#1F2532',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            outline: 'none',
          },
        },
        Option: {style: {backgroundColor: '#1F2532', color: '#FFFFFF'}},
      }}
      onItemSelect={e => {
        close();
        onItemSelect(e.item);
      }}
    />
  );

  return (
    <StatefulPopover
      placement={PLACEMENT.bottomRight}
      content={({close}) => renderMenu(close)}
    >
      {!children ? (
        <Button
          kind={KIND.secondary}
          size={SIZE.compact}
          overrides={{
            BaseButton: {
              style: {
                height: '36px',
                width: '36px',
                paddingLeft: 'unset',
                paddingRight: 'unset',
                paddingTop: 'unset',
                paddingBottom: 'unset',
              },
            },
          }}
        >
          <Overflow size={24} />
        </Button>
      ) : (
        children
      )}
    </StatefulPopover>
  );
};
