import React, {useState} from 'react';
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

interface Row {
  id: string;
  name: string;
  quantity: number;
  amount: number | null;
  total: number;
}

export const BudgetItemsPage = () => {
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
        <div>Budget Items</div>
        <div>Total: {formatUSD(rows.reduce((sum, r) => sum + r.total, 0))}</div>
      </div>
      <BorderlessTable $gridTemplateColumns="32fr 15fr 27fr 17fr 85px">
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
            quantity: 1,
            amount: null,
            total: 0,
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
  const recalculateTotal = (row: Row) => ({
    ...row,
    total: row.amount && row.quantity ? row.amount * row.quantity : 0,
  });
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
            onValueChanged={e =>
              onEdit(recalculateTotal({...row, quantity: parseInt(e)}))
            }
            placeholder="Enter quantity"
            alwaysEditing={isNewRow}
            type="number"
          />
          <EditableCurrencyField
            className={mainStyles}
            value={row.amount}
            onValueChanged={amount =>
              onEdit(recalculateTotal({...row, amount}))
            }
            placeholder="Amount"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
          <div className={mainStyles}>{formatUSD(row.total)}</div>
        </>
      )}
    </TableRow>
  );
}
