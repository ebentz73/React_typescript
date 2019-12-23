import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {TableBody} from './util/table-body';
import uuid from 'uuid/v4';
import {TableRow} from './util/table-row';
import {EditableTextField} from '../../common/fields/editable-text-field';
import {EditableCurrencyField} from '../../common/fields/editable-currency-field';
import {EditableDateField} from '../../common/fields/editable-date-field';

interface Row {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  amount: number | null;
}

export const PaymentSchedulePage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginTop: '20px',
    marginBottom: '26px',
  });
  const [rows, setRows] = useState<Row[]>([]);
  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css({
    ...tableStyles.header,
    border: 'none',
  });
  return (
    <div>
      <div className={headerStyles}>Payment Schedule</div>
      <BorderlessTable $gridTemplateColumns="22% 35% 15% 20% 8%">
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
  return (
    <TableRow onAdd={onAdd} onRemove={onRemove} isNewRow={isNewRow}>
      {({mainStyles, leftStyles}, add) => (
        <>
          <EditableTextField
            className={`${mainStyles} ${leftStyles}`}
            value={row.name}
            onValueChanged={e => onEdit({...row, name: e})}
            placeholder="Enter item name"
            alwaysEditing={isNewRow}
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
