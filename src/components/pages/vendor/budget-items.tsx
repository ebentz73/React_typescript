import React, {useState} from 'react';
import {
  useFrostedStyletron,
  getTableStyles,
  BorderlessTable,
  formatUSD,
} from '../../util';
import {TableBody} from './util/table-body';
import uuid from 'uuid/v4';
import {TableRow} from './util/table-row';
import {EditableTextField} from '../../common/fields/editable-text-field';
import {EditableCurrencyField} from '../../common/fields/editable-currency-field';

interface Row {
  id: string;
  name: string;
  quantity: number;
  amount: number | null;
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
      <BorderlessTable $gridTemplateColumns="32% 15% 27% 17% 9%">
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
            total: 'N/A',
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
    total:
      row.amount && row.quantity ? formatUSD(row.amount * row.quantity) : 'N/A',
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
