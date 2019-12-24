import React, {useState} from 'react';
import {sleep} from '../../../util';
import {useFrostedStyletron, getTableStyles} from '../../util';
import {Plus} from 'baseui/icon';

interface IdentifiableType {
  id: string;
}

interface TableRowProps<T extends IdentifiableType> {
  row: T;
  isNewRow: boolean;
  onAdd?: () => Promise<boolean>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: T) => Promise<void>;
}

export function TableBody<T extends IdentifiableType>({
  RowComponent,
  rows,
  setRows,
  createEmptyRow,
  addRowHeader,
  validateNewRow,
}: {
  RowComponent: React.FC<TableRowProps<T>>;
  rows: T[];
  setRows: (newRows: T[]) => void;
  createEmptyRow: () => T;
  addRowHeader: string;
  validateNewRow: (newRow: T) => boolean;
}) {
  const [css, theme] = useFrostedStyletron();
  const tableStyles = getTableStyles(theme);
  const addRowStyles = css({
    ...tableStyles.cell,
    gridColumn: '1 / span 5',
    paddingTop: '16px',
    paddingRight: '16px',
    paddingBottom: '16px',
    paddingLeft: '16px',
  });
  const addRowContentStyles = css({
    border: `1px dashed ${theme.colors.primary}`,
    borderRadius: '4px',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.colors.primary,
    fontSize: '12px',
    cursor: 'pointer',
  });

  const [newRow, setNewRow] = useState<T | null>(null);
  return (
    <>
      {!newRow ? (
        <div className={addRowStyles}>
          <div
            className={addRowContentStyles}
            onClick={() => setNewRow(createEmptyRow())}
          >
            <Plus />
            {addRowHeader}
          </div>
        </div>
      ) : (
        <RowComponent
          row={newRow}
          isNewRow={true}
          onAdd={async () => {
            if (!validateNewRow(newRow)) {
              return false;
            }
            await sleep(1000);
            setRows(rows.concat(newRow));
            setNewRow(null);
            return true;
          }}
          onRemove={async () => {
            setNewRow(null);
          }}
          onEdit={async newRow => {
            setNewRow(newRow);
          }}
        />
      )}
      {rows.map(row => (
        <RowComponent
          row={row}
          key={row.id}
          isNewRow={false}
          onRemove={async () => {
            await sleep(1000);
            setRows(rows.filter(r => r.id !== row.id));
          }}
          onEdit={async newRow => {
            await sleep(1000);
            setRows(rows.map(r => (r.id === newRow.id ? newRow : r)));
          }}
        />
      ))}
    </>
  );
}
