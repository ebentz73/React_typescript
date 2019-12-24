import React, {useRef} from 'react';
import {LoadingSpinner, useLatestValue, formatUSD} from '../../util';
import {safeUnwrap} from '../../../util';
import {EditableField} from './editable-field';
import {CurrencyInput} from '../inputs/currency-input';

export const EditableCurrencyField = ({
  value,
  onValueChanged,
  className,
  placeholder,
  alwaysEditing,
  onEnter,
}: {
  value: number | null;
  onValueChanged: (newValue: number | null) => Promise<void>;
  className: string;
  placeholder: string;
  alwaysEditing?: boolean;
  onEnter?: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onEnterRef = useLatestValue(onEnter);
  return (
    <EditableField
      value={value}
      onValueChanged={onValueChanged}
      className={className}
      regularContent={() => formatUSD(value || 0)}
      alwaysEditing={alwaysEditing}
      onEditBegin={() => {
        safeUnwrap(inputRef.current, c => setTimeout(() => c.focus()));
      }}
      editableContent={({
        editingValue,
        setEditingValue,
        isLoading,
        saveChanges,
      }) => {
        return (
          <CurrencyInput
            value={editingValue}
            placeholder={placeholder}
            inputRef={inputRef}
            onChange={setEditingValue}
            onKeyDown={async e => {
              if (e.key === 'Enter') {
                await saveChanges();
                safeUnwrap(onEnterRef.current, f => f());
              }
            }}
            onBlur={async () => await saveChanges()}
            overrides={{
              After: () => (isLoading ? <LoadingSpinner size="40px" /> : null),
            }}
          />
        );
      }}
    />
  );
};
