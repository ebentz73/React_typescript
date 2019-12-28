import React, {useContext} from 'react';
import {
  useFrostedStyletron,
  getTableStyles,
  BorderlessTable,
  formatUSD,
} from '../../util';
import {TableBody} from '../../common/editable-table/table-body';
import {TableRow} from '../../common/editable-table/table-row';
import {EditableTextField} from '../../common/editable-fields/editable-text-field';
import {EditableCurrencyField} from '../../common/editable-fields/editable-currency-field';
import {VendorContext} from '../../contexts/vendor';
import {BudgetItemSchema} from '../../../data/schema-types';

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
  const {
    state: {vendor},
    actions: {upsertBudgetItem, deleteBudgetItem},
  } = useContext(VendorContext);
  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css({
    ...tableStyles.header,
    border: 'none',
  });
  const validateRow = row => row.item && row.quantity && row.amount;
  return (
    <div>
      <div className={headerStyles}>
        <div>Budget Items</div>
        <div>
          Total:{' '}
          {formatUSD(
            vendor.budgetItems.reduce(
              (sum, r) => sum + r.quantity * r.amount,
              0
            )
          )}
        </div>
      </div>
      <BorderlessTable $gridTemplateColumns="32fr 15fr 27fr 17fr 85px">
        <div className={headerCellStyles}>ITEM</div>
        <div className={headerCellStyles}>QUANTITY</div>
        <div className={headerCellStyles}>AMOUNT</div>
        <div className={headerCellStyles}>TOTAL</div>
        <div className={headerCellStyles}></div>
        <TableBody
          rows={vendor.budgetItems}
          getRowId={row => row.id}
          addRowHeader="ADD ITEM"
          RowComponent={BudgetItemRow}
          createEmptyRow={() => ({
            id: 'new',
            item: '',
            quantity: 1,
            amount: 0,
            total: 0,
          })}
          onAdd={async newRow => {
            if (!validateRow(newRow)) {
              return false;
            }
            await upsertBudgetItem({
              id: null,
              vendorId: vendor.id,
              item: newRow.item,
              quantity: newRow.quantity,
              amount: newRow.amount,
            });
            return true;
          }}
          onEdit={async row => {
            if (!validateRow(row)) {
              return;
            }
            await upsertBudgetItem({
              id: row.id,
              vendorId: vendor.id,
              item: row.item,
              quantity: row.quantity,
              amount: row.amount,
            });
          }}
          onRemove={async id => {
            await deleteBudgetItem(id);
          }}
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
  row: BudgetItemSchema;
  isNewRow: boolean;
  onAdd?: () => Promise<boolean>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: BudgetItemSchema) => Promise<void>;
}) {
  return (
    <TableRow onAdd={onAdd} onRemove={onRemove} isNewRow={isNewRow}>
      {({mainStyles, leftStyles}, add) => (
        <>
          <EditableTextField
            className={`${mainStyles} ${leftStyles}`}
            value={row.item}
            onValueChanged={item => onEdit({...row, item})}
            placeholder="Enter item name"
            alwaysEditing={isNewRow}
          />
          <EditableTextField
            className={mainStyles}
            value={row.quantity.toString()}
            onValueChanged={quantity =>
              onEdit({...row, quantity: parseInt(quantity)})
            }
            placeholder="Enter quantity"
            alwaysEditing={isNewRow}
            type="number"
          />
          <EditableCurrencyField
            className={mainStyles}
            value={row.amount}
            onValueChanged={amount => onEdit({...row, amount: amount || 0})}
            placeholder="Amount"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
          <div className={mainStyles}>
            {formatUSD(row.amount * row.quantity)}
          </div>
        </>
      )}
    </TableRow>
  );
}
