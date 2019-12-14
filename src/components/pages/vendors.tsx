import React, {useState} from 'react';
import {useFrostedStyletron} from '../util';
import {StyledTable} from 'baseui/table-grid';
import {Button, KIND, SIZE} from 'baseui/button';
import {StatefulMenu} from 'baseui/menu';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {Overflow} from 'baseui/icon';

const data = Array(3)
  .fill(2)
  .map(() => [
    `Vendor name`,
    'Planner',
    'Denver, CO',
    'Lee Steen',
    'steen@deen.com',
    '(678) 628 5431',
  ]);

export const VendorsPage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerCellStyles = css({
    ...theme.fonts.tableHeader,
    color: '#B0AFAF',
    backgroundColor: theme.colors.tableHeadBackgroundColor,
    boxShadow: theme.lighting.shadow400,
    ...theme.borders.border300,
    borderTop: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.sizing.scale500,
    paddingRight: theme.sizing.scale600,
    paddingBottom: theme.sizing.scale500,
    paddingLeft: theme.sizing.scale600,
    ':last-of-type': {
      borderRight: 'none',
    },
  });
  const cellStyles = css({
    ...theme.fonts.tableContents,
    color: '#0B0C0E',
    paddingTop: theme.sizing.scale300,
    paddingRight: theme.sizing.scale600,
    paddingBottom: theme.sizing.scale300,
    paddingLeft: theme.sizing.scale600,
    display: 'flex',
    alignItems: 'center',
    height: '72px',
  });
  const hoveredCellStyles = css({
    backgroundColor: theme.colors.primary100,
    cursor: 'pointer',
  });
  const [hoveredRow, setHoveredRow] = useState(null as any);

  const menuItems = [{label: 'Edit'}, {label: 'Delete'}];
  const renderMenu = () => (
    <StatefulMenu
      items={menuItems}
      overrides={{
        List: {
          style: {
            backgroundColor: '#1F2532',
            borderRadius: '4px',
            outline: 'none',
          },
        },
        Option: {style: {backgroundColor: '#1F2532', color: '#FFFFFF'}},
      }}
    />
  );
  return (
    <div>
      <div
        className={css({
          ...theme.titleFont,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <div>Vendors</div>
        <div>
          <Button kind={KIND.primary} size={SIZE.compact}>
            +
          </Button>
        </div>
      </div>
      <div className={css({marginTop: '24px'})}>
        <StyledTable $gridTemplateColumns="24% 14% 14% 14% 14% 14% 6%">
          <div className={headerCellStyles}>VENDOR</div>
          <div className={headerCellStyles}>CATEGORY</div>
          <div className={headerCellStyles}>LOCATION</div>
          <div className={headerCellStyles}>POINT OF CONTACT</div>
          <div className={headerCellStyles}>EMAIL</div>
          <div className={headerCellStyles}>PHONE</div>
          <div className={headerCellStyles}></div>
          {data.map(row => {
            const styles =
              hoveredRow === row
                ? `${cellStyles} ${hoveredCellStyles}`
                : cellStyles;
            return (
              <div
                className={css({display: 'contents'})}
                key={row[0]}
                onMouseEnter={() => setHoveredRow(row)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div className={styles}>{row[0]}</div>
                <div className={styles}>{row[1]}</div>
                <div className={styles}>{row[2]}</div>
                <div className={styles}>{row[3]}</div>
                <div className={styles}>{row[4]}</div>
                <div className={styles}>{row[5]}</div>
                <div className={styles}>
                  <div>
                    <StatefulPopover
                      placement={PLACEMENT.bottomRight}
                      content={() => renderMenu()}
                    >
                      <div>
                        <Overflow
                          size={24}
                          color="#B0AFAF"
                          overrides={{Svg: {style: {cursor: 'pointer'}}}}
                        />
                      </div>
                    </StatefulPopover>
                  </div>
                </div>
              </div>
            );
          })}
        </StyledTable>
      </div>
    </div>
  );
};
