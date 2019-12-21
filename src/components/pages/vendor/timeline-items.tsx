import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {TableBody} from './util/table-body';
import uuid from 'uuid/v4';
import {TableRow} from './util/table-row';
import {EditableTextField} from '../../common/fields';

interface Row {
  id: string;
  date: string;
  time: string;
  description: string;
}

export const TimelineItemsPage = () => {
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
      <div className={headerStyles}>Timeline Items</div>
      <BorderlessTable $gridTemplateColumns="15% 15% 31% 31% 8%">
        <div className={headerCellStyles}>DATE</div>
        <div className={headerCellStyles}></div>
        <div className={headerCellStyles}>DESCRIPTION</div>
        <div className={headerCellStyles}>TAGS</div>
        <div className={headerCellStyles}></div>
        <TableBody
          rows={rows}
          setRows={setRows}
          addRowHeader="ADD ITEM"
          RowComponent={TimelineItemRow}
          createEmptyRow={() => ({
            id: uuid(),
            date: '',
            time: '',
            description: '',
          })}
          validateNewRow={newRow =>
            Boolean(newRow.date && newRow.time && newRow.description)
          }
        />
      </BorderlessTable>
    </div>
  );
};

function TimelineItemRow({
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
      {({mainStyles, leftStyles}) => (
        <>
          <EditableTextField
            className={`${mainStyles} ${leftStyles}`}
            value={row.date}
            onValueChanged={e => onEdit({...row, date: e})}
            placeholder="Select date"
            alwaysEditing={isNewRow}
          />
          <EditableTextField
            className={mainStyles}
            value={row.time}
            onValueChanged={e => onEdit({...row, time: e})}
            placeholder="Select time"
            alwaysEditing={isNewRow}
          />
          <EditableTextField
            className={mainStyles}
            value={row.description}
            onValueChanged={e => onEdit({...row, description: e})}
            placeholder="Enter description"
            alwaysEditing={isNewRow}
          />
          <div className={mainStyles}>Tags</div>
        </>
      )}
    </TableRow>
  );
}
