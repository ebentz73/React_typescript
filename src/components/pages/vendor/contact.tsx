import React, {useState, useMemo} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {EditableTextField} from '../../common/editable-fields/editable-text-field';
import {TableRow} from '../../common/editable-table/table-row';
import uuid from 'uuid/v4';
import {TableBody} from '../../common/editable-table/table-body';
import {EditableSelectField} from '../../common/editable-fields/editable-select-field';
import {Option} from 'baseui/select';

interface Row {
  id: string;
  name: string;
  type: Option;
  phone: string;
  email: string;
}

export const ContactPage = () => {
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
      <div className={headerStyles}>Contact Information</div>
      <BorderlessTable $gridTemplateColumns="28fr 14fr 18fr 32fr 85px">
        <div className={headerCellStyles}>NAME</div>
        <div className={headerCellStyles}>TYPE</div>
        <div className={headerCellStyles}>PHONE</div>
        <div className={headerCellStyles}>EMAIL</div>
        <div className={headerCellStyles}></div>
        <TableBody
          rows={rows}
          setRows={setRows}
          addRowHeader="ADD CONTACT"
          RowComponent={ContactRow}
          createEmptyRow={() => ({
            id: uuid(),
            name: '',
            type: {id: 'Primary', label: 'Primary'},
            phone: '',
            email: '',
          })}
          validateNewRow={newRow =>
            Boolean(newRow.name && newRow.phone && newRow.email)
          }
        />
      </BorderlessTable>
    </div>
  );
};

function ContactRow({
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
  const typeOptions = useMemo(
    () => [
      {id: 'Primary', label: 'Primary'},
      {id: 'DayOf', label: 'Day-of'},
      {id: 'Other', label: 'Other'},
    ],
    []
  );
  return (
    <TableRow onAdd={onAdd} onRemove={onRemove} isNewRow={isNewRow}>
      {({mainStyles, leftStyles}, add) => (
        <>
          <EditableTextField
            className={`${mainStyles} ${leftStyles}`}
            value={row.name}
            onValueChanged={e => onEdit({...row, name: e})}
            placeholder="Enter name"
            alwaysEditing={isNewRow}
          />
          <EditableSelectField
            options={typeOptions}
            className={mainStyles}
            value={row.type}
            onValueChanged={e => onEdit({...row, type: e})}
            alwaysEditing={isNewRow}
          />
          <EditableTextField
            className={mainStyles}
            value={row.phone}
            onValueChanged={e => onEdit({...row, phone: e})}
            placeholder="Enter phone"
            alwaysEditing={isNewRow}
            type="phone"
          />
          <EditableTextField
            className={mainStyles}
            value={row.email}
            onValueChanged={async e => await onEdit({...row, email: e})}
            placeholder="Enter email"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
        </>
      )}
    </TableRow>
  );
}
