import React, {useMemo, useContext} from 'react';
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
import {EditableDateField} from '../../common/editable-fields/editable-date-field';
import {unwrap} from '../../../util';
import {VendorContext} from '../../contexts/vendor';
import {PaymentScheduleSchema} from '../../../data/schema-types';

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
  const {
    state: {vendor},
    actions: {upsertPaymentSchedule, deletePaymentSchedule},
  } = useContext(VendorContext);
  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css({
    ...tableStyles.header,
    border: 'none',
  });
  const validateRow = row => row.item && row.dueDate && row.amount;
  return (
    <div>
      <div className={headerStyles}>
        <div>Payment Schedule</div>
        <div>
          Remaining balance due:{' '}
          {formatUSD(
            vendor.paymentSchedule
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
          rows={vendor.paymentSchedule}
          getRowId={row => row.id}
          addRowHeader="ADD ITEM"
          RowComponent={PaymentScheduleRow}
          createEmptyRow={() => ({
            id: 'new',
            item: '',
            description: '',
            dueDate: Date.now(),
            amount: 0,
            isPaid: false,
          })}
          onAdd={async newRow => {
            if (!validateRow(newRow)) {
              return false;
            }
            await upsertPaymentSchedule({
              id: null,
              vendorId: vendor.id,
              item: newRow.item,
              description: newRow.description,
              dueDate: newRow.dueDate,
              amount: newRow.amount,
              isPaid: false,
            });
            return true;
          }}
          onEdit={async row => {
            if (!validateRow(row)) {
              return;
            }
            await upsertPaymentSchedule({
              id: row.id,
              vendorId: vendor.id,
              item: row.item,
              description: row.description,
              dueDate: row.dueDate,
              amount: row.amount,
              isPaid: row.isPaid,
            });
          }}
          onRemove={async id => {
            await deletePaymentSchedule(id);
          }}
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
  row: PaymentScheduleSchema;
  isNewRow: boolean;
  onAdd?: () => Promise<boolean>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: PaymentScheduleSchema) => Promise<void>;
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
            value={row.item}
            onValueChanged={item => onEdit({...row, item})}
            placeholder="Enter item name"
            alwaysEditing={isNewRow}
            regularContent={() => (
              <div className={css({display: 'flex'})}>
                <div>{row.item}</div>
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
            value={new Date(row.dueDate)}
            onValueChanged={e => onEdit({...row, dueDate: e.valueOf()})}
            alwaysEditing={isNewRow}
          />
          <EditableCurrencyField
            className={mainStyles}
            value={row.amount}
            onValueChanged={amount => onEdit({...row, amount: amount || 0})}
            placeholder="Amount"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
        </>
      )}
    </TableRow>
  );
}
