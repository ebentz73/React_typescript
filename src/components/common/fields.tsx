import React, {useState, ReactNode, useRef} from 'react';
import {useFrostedStyletron, LoadingSpinner, useLatestValue} from '../util';
import {HoverableDiv} from './util';
import {ChevronLeft} from 'baseui/icon';
import {Input} from 'baseui/input';
import {safeUnwrap} from '../../util';

export const EditableTextField = ({
  value,
  onValueChanged,
  className,
  placeholder,
  alwaysEditing,
  onEnter,
}: {
  value: string;
  onValueChanged: (newValue: string) => Promise<void>;
  className: string;
  placeholder: string;
  alwaysEditing?: boolean;
  onEnter?: () => void;
}) => {
  const [editingValue, setEditingValue] = useState(value);
  const [isLoading, setLoading] = useState(false);

  const saveChanges = async stopEditing => {
    setLoading(true);
    try {
      await onValueChanged(editingValue);
    } finally {
      setLoading(false);
      stopEditing();
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const onEnterRef = useLatestValue(onEnter);
  return (
    <EditableField
      className={className}
      regularContent={() => value}
      alwaysEditing={alwaysEditing}
      onEditBegin={() => {
        setEditingValue(value);
        setTimeout(() => safeUnwrap(inputRef.current, c => c.focus()));
      }}
      editableContent={stopEditing => {
        return (
          <Input
            value={editingValue}
            placeholder={placeholder}
            inputRef={inputRef}
            onChange={e => setEditingValue(e.currentTarget.value)}
            onKeyDown={async e => {
              if (e.key === 'Enter') {
                await saveChanges(stopEditing);
                safeUnwrap(onEnterRef.current, f => f());
              }
            }}
            onBlur={async () => await saveChanges(stopEditing)}
            overrides={{
              After: () => (isLoading ? <LoadingSpinner size="40px" /> : null),
            }}
          />
        );
      }}
    />
  );
};

export const EditableField = ({
  regularContent,
  editableContent,
  className,
  onEditBegin,
  alwaysEditing,
}: {
  regularContent: () => ReactNode;
  editableContent: (stopEditing: () => void) => ReactNode;
  className: string;
  onEditBegin: () => void;
  alwaysEditing?: boolean;
}) => {
  const [isEditing, setEditing] = useState(alwaysEditing || false);

  const [css] = useFrostedStyletron();
  const containerStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

  return (
    <HoverableDiv className={className}>
      {isHovered =>
        isEditing ? (
          editableContent(() => (!alwaysEditing ? setEditing(false) : null))
        ) : (
          <div
            className={containerStyles}
            onClick={() => {
              onEditBegin();
              setEditing(true);
            }}
          >
            <div>{regularContent()}</div>
            {isHovered && <ChevronLeft size={32} />}
          </div>
        )
      }
    </HoverableDiv>
  );
};
