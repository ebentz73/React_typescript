import React, {useRef, useEffect} from 'react';
import {EditableField} from './editable-field';
import {DateInput} from '../inputs/date-input';
import moment from 'moment';
import {Datepicker} from 'baseui/datepicker';

export const EditableDateField = ({
  value,
  onValueChanged,
  className,
  alwaysEditing,
}: {
  value: Date;
  onValueChanged: (newValue: Date) => Promise<void>;
  className: string;
  alwaysEditing?: boolean;
}) => {
  return (
    <EditableField
      value={value}
      onValueChanged={onValueChanged}
      className={className}
      regularContent={() => moment(value).format('D MMM YY')}
      alwaysEditing={alwaysEditing}
      editableContent={({
        editingValue,
        setEditingValue,
        isLoading,
        saveChanges,
      }) => {
        return (
          <EditableContent
            editingValue={editingValue}
            setEditingValue={setEditingValue}
            saveChanges={saveChanges}
            alwaysEditing={alwaysEditing}
            isLoading={isLoading}
          />
        );
      }}
    />
  );
};

function EditableContent({
  editingValue,
  setEditingValue,
  isLoading,
  saveChanges,
  alwaysEditing,
}) {
  const datepickerRef = useRef<Datepicker>(null);
  useEffect(() => {
    if (!alwaysEditing && datepickerRef.current) {
      datepickerRef.current.open();
    }
  }, []);

  return (
    <DateInput
      value={editingValue}
      datepickerRef={datepickerRef}
      onValueChanged={date => {
        setEditingValue(date);
        setTimeout(saveChanges);
      }}
      isLoading={isLoading}
      onClose={() => saveChanges()}
    />
  );
}
