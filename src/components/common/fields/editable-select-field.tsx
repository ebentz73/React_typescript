import React from 'react';
import {EditableField} from './editable-field';
import {Option, TYPE} from 'baseui/select';
import {LoadingSpinner} from '../../util';
import {Select} from 'baseui/select';

export const EditableSelectField = ({
  value,
  onValueChanged,
  options,
  className,
  alwaysEditing,
}: {
  value: Option;
  onValueChanged: (newValue: Option) => Promise<void>;
  options: Option[];
  className: string;
  alwaysEditing?: boolean;
}) => {
  return (
    <EditableField
      value={value}
      onValueChanged={onValueChanged}
      className={className}
      regularContent={() => value.label}
      alwaysEditing={alwaysEditing}
      editableContent={({
        editingValue,
        setEditingValue,
        isLoading,
        saveChanges,
      }) => {
        return (
          <Select
            options={options}
            isLoading={isLoading}
            type={TYPE.select}
            clearable={false}
            searchable={false}
            onChange={({value}) => {
              setEditingValue(value[0]);
              setTimeout(saveChanges);
            }}
            overrides={{
              LoadingIndicator: () => <LoadingSpinner size="20px" />,
            }}
            value={editingValue as any}
            onBlur={() => saveChanges()}
            startOpen={!alwaysEditing}
          />
        );
      }}
    />
  );
};
