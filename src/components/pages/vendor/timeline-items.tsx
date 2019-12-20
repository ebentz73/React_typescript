import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {Plus} from 'baseui/icon';
import {getAddRowStyles} from './util';

export const TimelineItemsPage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginTop: '20px',
    marginBottom: '26px',
  });
  const rows = [
    {
      date: '25 Sep 2019 at 10:15 AM',
      description: 'Florist arrives at Venue',
    },
  ];
  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css({
    ...tableStyles.header,
    border: 'none',
  });
  const cellStyles = css(tableStyles.cell);
  const [, setHoveredRow] = useState(null as any);
  const addRowStyles = css({
    ...tableStyles.cell,
    gridColumn: '1 / span 5',
    paddingTop: '16px',
    paddingRight: '16px',
    paddingBottom: '16px',
    paddingLeft: '16px',
  });
  const addRowContentStyles = css(getAddRowStyles(theme));
  return (
    <div>
      <div className={headerStyles}>Timeline Items</div>
      <BorderlessTable $gridTemplateColumns="31% 31% 31% 7%">
        <div className={headerCellStyles}>DATE</div>
        <div className={headerCellStyles}>DESCRIPTION</div>
        <div className={headerCellStyles}>TAGS</div>
        <div className={headerCellStyles}></div>
        <div className={addRowStyles}>
          <div className={addRowContentStyles}>
            <Plus />
            ADD CONTACT
          </div>
        </div>
        {rows.map(row => {
          return (
            <div
              className={css({display: 'contents'})}
              key={row.date}
              onMouseEnter={() => setHoveredRow(row)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className={cellStyles}>{row.date}</div>
              <div className={cellStyles}>{row.description}</div>
              <div className={cellStyles}>
                <Plus />
              </div>
              <div
                className={cellStyles}
                onClick={e => e.stopPropagation()}
              ></div>
            </div>
          );
        })}
      </BorderlessTable>
    </div>
  );
};
