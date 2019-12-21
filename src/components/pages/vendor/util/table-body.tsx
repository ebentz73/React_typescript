import React, {useState} from 'react';
import {sleep} from '../../../../util';
import {useFrostedStyletron, getTableStyles} from '../../../util';
import {getAddRowStyles} from '../util';
import {Plus} from 'baseui/icon';

interface IdentifiableType {
  id: string;
}

interface TableRowProps<T extends IdentifiableType> {
  row: T;
  isNewRow: boolean;
  onAdd?: () => Promise<void>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: T) => Promise<void>;
}

export function TableBody<T extends IdentifiableType>({
  RowComponent,
  rows,
  setRows,
  createEmptyRow,
  addRowHeader,
}: {
  RowComponent: React.FC<TableRowProps<T>>;
  rows: T[];
  setRows: (newRows: T[]) => void;
  createEmptyRow: () => T;
  addRowHeader: string;
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
  const addRowContentStyles = css(getAddRowStyles(theme));

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
            await sleep(1000);
            setRows(rows.concat(newRow));
            setNewRow(null);
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
