import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {TableBody} from './util/table-body';
import uuid from 'uuid/v4';
import {TableRow} from './util/table-row';
import {EditableTextField} from '../../common/fields';

interface Row {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  amount: string;
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
      <BorderlessTable $gridTemplateColumns="22% 42% 15% 15% 6%">
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
            dueDate: '',
            amount: '',
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
          <EditableTextField
            className={mainStyles}
            value={row.dueDate}
            onValueChanged={e => onEdit({...row, dueDate: e})}
            placeholder="Select type"
            alwaysEditing={isNewRow}
          />
          <EditableTextField
            className={mainStyles}
            value={row.amount}
            onValueChanged={e => onEdit({...row, amount: e})}
            placeholder="Enter phone"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
        </>
      )}
    </TableRow>
  );
}
