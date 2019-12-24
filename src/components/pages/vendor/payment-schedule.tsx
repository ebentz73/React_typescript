import React, {useState, useMemo} from 'react';
import {
  useFrostedStyletron,
  getTableStyles,
  BorderlessTable,
  formatUSD,
} from '../../util';
import {TableBody} from '../../common/editable-table/table-body';
import uuid from 'uuid/v4';
import {TableRow} from '../../common/editable-table/table-row';
import {EditableTextField} from '../../common/editable-fields/editable-text-field';
import {EditableCurrencyField} from '../../common/editable-fields/editable-currency-field';
import {EditableDateField} from '../../common/editable-fields/editable-date-field';
import {unwrap} from '../../../util';

interface Row {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  amount: number | null;
  isPaid: boolean;
}

export const PaymentSchedulePage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginRight: '32px',
    marginTop: '20px',
    marginBottom: '26px',
    display: 'flex',
    justifyContent: 'space-between',
  });
  const [rows, setRows] = useState<Row[]>([]);
  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css({
    ...tableStyles.header,
    border: 'none',
  });
  return (
    <div>
      <div className={headerStyles}>
        <div>Payment Schedule</div>
        <div>
          Remaining balance due:{' '}
          {formatUSD(
            rows
              .filter(r => !r.isPaid)
              .reduce((sum, r) => sum + unwrap(r.amount), 0)
          )}
        </div>
      </div>
      <BorderlessTable $gridTemplateColumns="22fr 35fr 15fr 20fr 85px">
        <div className={headerCellStyles}>ITEM</div>
        <div className={headerCellStyles}></div>
        <div className={headerCellStyles}>DUE DATE</div>
        <div className={headerCellStyles}>AMOUNT</div>
        <div className={headerCellStyles}></div>
        <TableBody
          rows={rows}
          setRows={setRows}
          addRowHeader="ADD ITEM"
          RowComponent={PaymentScheduleRow}
          createEmptyRow={() => ({
            id: uuid(),
            name: '',
            description: '',
            dueDate: new Date(),
            amount: null,
            isPaid: false,
          })}
          validateNewRow={newRow =>
            Boolean(newRow.name && newRow.dueDate && newRow.amount)
          }
        />
      </BorderlessTable>
    </div>
  );
};

function PaymentScheduleRow({
  row,
  isNewRow,
  onAdd,
  onRemove,
  onEdit,
}: {
  row: Row;
  isNewRow: boolean;
  onAdd?: () => Promise<boolean>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: Row) => Promise<void>;
}) {
  const customContextActions = useMemo(
    () => [
      {
        id: 'Pay',
        label: row.isPaid ? 'Mark as unpaid' : 'Mark as paid',
        action: async () => await onEdit({...row, isPaid: !row.isPaid}),
      },
      {
        id: 'Delete',
        label: 'Delete',
        action: async () => await onRemove(),
      },
    ],
    [row, onEdit]
  );
  const [css] = useFrostedStyletron();
  const paidTextStyles = css({
    color: '#51C339',
    fontSize: '10px',
    marginLeft: '8px',
  });
  return (
    <TableRow
      onAdd={onAdd}
      onRemove={onRemove}
      isNewRow={isNewRow}
      customContextActions={customContextActions}
    >
      {({mainStyles, leftStyles}, add) => (
        <>
          <EditableTextField
            className={`${mainStyles} ${leftStyles}`}
            value={row.name}
            onValueChanged={e => onEdit({...row, name: e})}
            placeholder="Enter item name"
            alwaysEditing={isNewRow}
            regularContent={() => (
              <div className={css({display: 'flex'})}>
                <div>{row.name}</div>
                {row.isPaid && <div className={paidTextStyles}>PAID</div>}
              </div>
            )}
          />
          <EditableTextField
            className={mainStyles}
            value={row.description}
            onValueChanged={e => onEdit({...row, description: e})}
            placeholder="Enter description"
            alwaysEditing={isNewRow}
          />
          <EditableDateField
            className={mainStyles}
            value={row.dueDate}
            onValueChanged={e => onEdit({...row, dueDate: e})}
            alwaysEditing={isNewRow}
          />
          <EditableCurrencyField
            className={mainStyles}
            value={row.amount}
            onValueChanged={amount => onEdit({...row, amount})}
            placeholder="Amount"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
        </>
      )}
    </TableRow>
  );
}
