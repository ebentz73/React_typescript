import React, {useRef, ReactNode} from 'react';
import {LoadingSpinner, useLatestValue} from '../../util';
import {Input} from 'baseui/input';
import {safeUnwrap} from '../../../util';
import {EditableField} from './editable-field';
import {parsePhoneInput} from '../util';

export const EditableTextField = ({
  value,
  onValueChanged,
  className,
  placeholder,
  alwaysEditing,
  onEnter,
  type,
  regularContent,
}: {
  value: string;
  onValueChanged: (newValue: string) => Promise<void>;
  className: string;
  placeholder: string;
  alwaysEditing?: boolean;
  onEnter?: () => void;
  type?: 'phone' | 'text' | 'number';
  regularContent?: () => ReactNode;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onEnterRef = useLatestValue(onEnter);
  return (
    <EditableField
      value={value}
      onValueChanged={onValueChanged}
      className={className}
      regularContent={regularContent || (() => value)}
      alwaysEditing={alwaysEditing}
      onEditBegin={() => {
        setTimeout(() => safeUnwrap(inputRef.current, c => c.focus()));
      }}
      editableContent={({
        editingValue,
        setEditingValue,
        isLoading,
        saveChanges,
      }) => {
        const isPhone = type === 'phone';
        return (
          <Input
            value={editingValue}
            placeholder={placeholder}
            inputRef={inputRef}
            type={isPhone ? 'text' : type}
            onChange={e =>
              setEditingValue(
                isPhone
                  ? parsePhoneInput(editingValue, e.currentTarget.value)
                  : e.currentTarget.value
              )
            }
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
