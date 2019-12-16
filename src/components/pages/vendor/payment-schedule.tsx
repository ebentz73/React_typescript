import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {Plus} from 'baseui/icon';
import {getAddRowStyles} from './util';

export const PaymentSchedulePage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginTop: '20px',
    marginBottom: '26px',
  });
  const rows = [
    {
      name: 'Flowers Outstanding',
      dueDate: '25 Sep 2019',
      amount: '$151.00',
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
    padding: '16px',
  });
  const addRowContentStyles = css(getAddRowStyles(theme));
  return (
    <div>
      <div className={headerStyles}>Payment Schedule</div>
      <BorderlessTable $gridTemplateColumns="64% 15% 15% 6%">
        <div className={headerCellStyles}>ITEM</div>
        <div className={headerCellStyles}>DUE DATE</div>
        <div className={headerCellStyles}>AMOUNT</div>
        <div className={headerCellStyles}></div>
        <div className={addRowStyles}>
          <div className={addRowContentStyles}>
            <Plus />
            ADD ITEM
          </div>
        </div>
        {rows.map(row => {
          return (
            <div
              className={css({display: 'contents'})}
              key={row.name}
              onMouseEnter={() => setHoveredRow(row)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className={cellStyles}>{row.name}</div>
              <div className={cellStyles}>{row.dueDate}</div>
              <div className={cellStyles}>{row.amount}</div>
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
