import React, {ReactNode, useState} from 'react';
import {useFrostedStyletron, useLatestValue} from '../../util';
import {HoverableDiv} from '../util';
import {ChevronLeft} from 'baseui/icon';

export function EditableField<T>({
  value,
  onValueChanged,
  regularContent,
  editableContent,
  className,
  onEditBegin,
  alwaysEditing,
}: {
  value: T;
  onValueChanged: (newValue: T) => void;
  regularContent: () => ReactNode;
  editableContent: (info: {
    isLoading: boolean;
    editingValue: T;
    setEditingValue: (value: T) => void;
    saveChanges: () => Promise<void>;
  }) => ReactNode;
  className: string;
  onEditBegin?: () => void;
  alwaysEditing?: boolean;
}) {
  const [isEditing, setEditing] = useState(alwaysEditing);
  const [editingValue, setEditingValue] = useState(value);
  const [isLoading, setLoading] = useState(false);

  const [css] = useFrostedStyletron();
  const containerStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

  const latestEditingValue = useLatestValue(editingValue);
  const saveChanges = async () => {
    setLoading(true);
    try {
      await onValueChanged(latestEditingValue.current);
    } finally {
      setLoading(false);
      if (!alwaysEditing) {
        setEditing(false);
      }
    }
  };

  return (
    <HoverableDiv className={className}>
      {isHovered =>
        isEditing ? (
          editableContent({
            isLoading,
            editingValue,
            setEditingValue,
            saveChanges,
          })
        ) : (
          <div
            className={containerStyles}
            onClick={() => {
              setEditing(true);
              setEditingValue(value);
              onEditBegin && onEditBegin();
            }}
          >
            <div>{regularContent()}</div>
            {isHovered && <ChevronLeft size={32} />}
          </div>
        )
      }
    </HoverableDiv>
  );
}
