import React, {Ref, KeyboardEventHandler, FocusEventHandler} from 'react';
import {Input, InputOverrides} from 'baseui/input';
import {safeUnwrap} from '../../../util';

export const CurrencyInput = ({
  value,
  onChange,
  placeholder,
  inputRef,
  onKeyDown,
  onBlur,
  overrides,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  overrides?: InputOverrides;
}) => {
  return (
    <Input
      value={safeUnwrap(value, v => v.toString()) || ''}
      onChange={e =>
        onChange(safeUnwrap(e.currentTarget.value, v => parseInt(v)))
      }
      type="number"
      startEnhancer="$"
      endEnhancer=".00"
      placeholder={placeholder}
      inputRef={inputRef}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      overrides={overrides}
    />
  );
};
