import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {TableBody} from './util/table-body';
import uuid from 'uuid/v4';
import {TableRow} from './util/table-row';
import {EditableTextField} from '../../common/fields';

interface Row {
  id: string;
  name: string;
  quantity: string;
  amount: string;
  total: string;
}

export const BudgetItemsPage = () => {
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
      <div className={headerStyles}>Budget Items</div>
      <BorderlessTable $gridTemplateColumns="32% 15% 15% 32% 6%">
        <div className={headerCellStyles}>ITEM</div>
        <div className={headerCellStyles}>QUANTITY</div>
        <div className={headerCellStyles}>AMOUNT</div>
        <div className={headerCellStyles}>TOTAL</div>
        <div className={headerCellStyles}></div>
        <TableBody
          rows={rows}
          setRows={setRows}
          addRowHeader="ADD ITEM"
          RowComponent={BudgetItemRow}
          createEmptyRow={() => ({
            id: uuid(),
            name: '',
            quantity: '',
            amount: '',
            total: '$99.99',
          })}
          validateNewRow={newRow =>
            Boolean(
              newRow.name && newRow.quantity && newRow.amount && newRow.total
            )
          }
        />
      </BorderlessTable>
    </div>
  );
};

function BudgetItemRow({
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
            value={row.quantity.toString()}
            onValueChanged={e => onEdit({...row, quantity: e})}
            placeholder="Enter quantity"
            alwaysEditing={isNewRow}
          />
          <EditableTextField
            className={mainStyles}
            value={row.amount}
            onValueChanged={e => onEdit({...row, amount: e})}
            placeholder="Enter amount"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
          <div className={mainStyles}>{row.total}</div>
        </>
      )}
    </TableRow>
  );
}
