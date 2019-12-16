import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {Plus} from 'baseui/icon';
import {getAddRowStyles} from './util';

export const ContactPage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginTop: '20px',
    marginBottom: '26px',
  });
  const rows = [
    {
      name: 'Lee Alexander',
      type: 'Primary',
      phone: '+1 6786285431',
      email: 'rlalexander@deen.com',
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
      <div className={headerStyles}>Contact Information</div>
      <BorderlessTable $gridTemplateColumns="32% 15% 15% 32% 6%">
        <div className={headerCellStyles}>NAME</div>
        <div className={headerCellStyles}>TYPE</div>
        <div className={headerCellStyles}>PHONE</div>
        <div className={headerCellStyles}>EMAIL</div>
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
              key={row.name}
              onMouseEnter={() => setHoveredRow(row)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className={cellStyles}>{row.name}</div>
              <div className={cellStyles}>{row.type}</div>
              <div className={cellStyles}>{row.phone}</div>
              <div className={cellStyles}>{row.email}</div>
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
