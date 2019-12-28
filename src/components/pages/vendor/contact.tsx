import React, {useMemo, useContext} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {EditableTextField} from '../../common/editable-fields/editable-text-field';
import {TableRow} from '../../common/editable-table/table-row';
import {TableBody} from '../../common/editable-table/table-body';
import {EditableSelectField} from '../../common/editable-fields/editable-select-field';
import {VendorContext} from '../../contexts/vendor';
import {VendorContactSchema} from '../../../data/schema-types';
import {VendorContactKind} from '../../../constants/vendor-contact-kind';
import {unwrap} from '../../../util';

export const ContactPage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginTop: '20px',
    marginBottom: '26px',
  });
  const {
    state: {vendor},
    actions: {upsertContact, deleteContact},
  } = useContext(VendorContext);
  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css({
    ...tableStyles.header,
    border: 'none',
  });
  const validateRow = row =>
    row.contact.name && row.contact.phone && row.contact.email;

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
          rows={vendor.contacts}
          getRowId={r => r.contact.id}
          addRowHeader="ADD CONTACT"
          RowComponent={ContactRow}
          createEmptyRow={() => ({
            contactKind: VendorContactKind.Primary,
            contact: {
              id: 'new',
              name: '',
              phone: '',
              email: '',
            },
          })}
          onAdd={async newRow => {
            if (!validateRow(newRow)) {
              return false;
            }
            const {contact, contactKind} = newRow;
            await upsertContact(vendor.id, {
              contact: {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
              },
              contactKind,
            });
            return true;
          }}
          onEdit={async row => {
            if (!validateRow(row)) {
              return;
            }
            const {contact, contactKind} = row;
            await upsertContact(vendor.id, {
              contact: {
                id: contact.id,
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
              },
              contactKind,
            });
          }}
          onRemove={async contactId => {
            await deleteContact(vendor.id, contactId);
          }}
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
  row: VendorContactSchema;
  isNewRow: boolean;
  onAdd?: () => Promise<boolean>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: VendorContactSchema) => Promise<void>;
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
            value={row.contact.name}
            onValueChanged={name =>
              onEdit({...row, contact: {...row.contact, name}})
            }
            placeholder="Enter name"
            alwaysEditing={isNewRow}
          />
          <EditableSelectField
            options={typeOptions}
            className={mainStyles}
            value={unwrap(typeOptions.find(o => o.id === row.contactKind))}
            onValueChanged={kind =>
              onEdit({...row, contactKind: kind.id as VendorContactKind})
            }
            alwaysEditing={isNewRow}
          />
          <EditableTextField
            className={mainStyles}
            value={row.contact.phone}
            onValueChanged={phone =>
              onEdit({...row, contact: {...row.contact, phone}})
            }
            placeholder="Enter phone"
            alwaysEditing={isNewRow}
            type="phone"
          />
          <EditableTextField
            className={mainStyles}
            value={row.contact.email}
            onValueChanged={async email =>
              await onEdit({...row, contact: {...row.contact, email}})
            }
            placeholder="Enter email"
            alwaysEditing={isNewRow}
            onEnter={() => isNewRow && add()}
          />
        </>
      )}
    </TableRow>
  );
}
