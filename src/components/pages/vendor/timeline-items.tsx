import React, {useMemo, useContext} from 'react';
import {useFrostedStyletron, getTableStyles, BorderlessTable} from '../../util';
import {TableBody} from '../../common/editable-table/table-body';
import {TableRow} from '../../common/editable-table/table-row';
import {EditableTextField} from '../../common/editable-fields/editable-text-field';
import {EditableDateField} from '../../common/editable-fields/editable-date-field';
import {EditableSelectField} from '../../common/editable-fields/editable-select-field';
import {
  createTimeInputOptions,
  TimeOption,
} from '../../common/inputs/time-input';
import moment from 'moment';
import {VendorContext} from '../../contexts/vendor';
import {TimelineItemSchema} from '../../../data/schema-types';
import {unwrap} from '../../../util';

export const TimelineItemsPage = () => {
  const [css, theme] = useFrostedStyletron();
  const headerStyles = css({
    fontSize: '18px',
    marginLeft: '32px',
    marginTop: '20px',
    marginBottom: '26px',
  });
  const {
    state: {vendor},
    actions: {upsertTimelineItem, deleteTimelineItem},
  } = useContext(VendorContext);
  const tableStyles = getTableStyles(theme);
  const headerCellStyles = css({
    ...tableStyles.header,
    border: 'none',
  });
  const validateRow = row => Boolean(row.description);
  return (
    <div>
      <div className={headerStyles}>Timeline Items</div>
      <BorderlessTable $gridTemplateColumns="1fr 1fr 2fr 2fr 85px">
        <div className={headerCellStyles}>DATE</div>
        <div className={headerCellStyles}></div>
        <div className={headerCellStyles}>DESCRIPTION</div>
        <div className={headerCellStyles}>TAGS</div>
        <div className={headerCellStyles}></div>
        <TableBody
          rows={vendor.timelineItems}
          getRowId={row => row.id}
          addRowHeader="ADD ITEM"
          RowComponent={TimelineItemRow}
          createEmptyRow={() => ({
            id: 'new',
            date: moment(Date.now())
              .hour(12)
              .minute(0)
              .valueOf(),
            description: '',
          })}
          onAdd={async newRow => {
            if (!validateRow(newRow)) {
              return false;
            }
            await upsertTimelineItem({
              id: null,
              date: newRow.date,
              description: newRow.description,
              vendorId: vendor.id,
            });
            return true;
          }}
          onEdit={async row => {
            if (!validateRow(row)) {
              return;
            }
            await upsertTimelineItem({
              id: row.id,
              date: row.date,
              description: row.description,
              vendorId: vendor.id,
            });
          }}
          onRemove={async id => {
            await deleteTimelineItem(id);
          }}
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
  row: TimelineItemSchema;
  isNewRow: boolean;
  onAdd?: () => Promise<boolean>;
  onRemove: () => Promise<void>;
  onEdit: (newRow: TimelineItemSchema) => Promise<void>;
}) {
  const timeOptions = useMemo(() => createTimeInputOptions(), []);
  const day = moment(row.date)
    .startOf('day')
    .toDate();
  const dateAndTime = moment(row.date);
  const timeOption = useMemo(
    () =>
      unwrap(
        timeOptions.find(
          o =>
            o.hour === dateAndTime.hour() && o.minute === dateAndTime.minute()
        )
      ),
    [timeOptions, row]
  );
  const getNewDate = (newDay, newHour, newMinute) =>
    moment(newDay)
      .startOf('day')
      .add(newHour, 'hours')
      .add(newMinute, 'minutes')
      .valueOf();

  return (
    <TableRow onAdd={onAdd} onRemove={onRemove} isNewRow={isNewRow}>
      {({mainStyles, leftStyles}) => (
        <>
          <EditableDateField
            className={`${mainStyles} ${leftStyles}`}
            value={day}
            onValueChanged={e =>
              onEdit({
                ...row,
                date: getNewDate(e, dateAndTime.hours(), dateAndTime.minutes()),
              })
            }
            alwaysEditing={isNewRow}
          />
          <EditableSelectField
            options={timeOptions}
            className={mainStyles}
            value={timeOption}
            onValueChanged={(e: TimeOption) =>
              onEdit({...row, date: getNewDate(row.date, e.hour, e.minute)})
            }
            alwaysEditing={isNewRow}
            isVirtualList={true}
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
