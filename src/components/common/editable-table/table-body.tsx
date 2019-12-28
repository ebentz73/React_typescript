import React, {useState} from 'react';
import {useFrostedStyletron, getTableStyles} from '../../util';
import {Plus} from 'baseui/icon';

interface TableRowProps<T> {
  row: T;
  isNewRow: boolean;
  onAdd?: () => Promise<boolean>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: T) => Promise<void>;
}

export function TableBody<T>({
  RowComponent,
  rows,
  createEmptyRow,
  addRowHeader,
  onAdd,
  onEdit,
  onRemove,
  getRowId,
}: {
  RowComponent: React.FC<TableRowProps<T>>;
  rows: T[];
  createEmptyRow: () => T;
  addRowHeader: string;
  onAdd: (newRow: T) => Promise<boolean>;
  onEdit: (row: T) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  getRowId: (row: T) => string;
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
            if (!(await onAdd(newRow))) {
              return false;
            }
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
          key={getRowId(row)}
          isNewRow={false}
          onRemove={async () => {
            await onRemove(getRowId(row));
          }}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}
