import React, {ReactNode, useState, useMemo, useCallback} from 'react';
import {HoverableDiv} from '../util';
import {
  useFrostedStyletron,
  getTableStyles,
  LoadingSpinner,
  MoreOptionsButton,
  useMounted,
} from '../../util';
import {Delete, Overflow} from 'baseui/icon';
import {unwrap, safeUnwrap} from '../../../util';

interface CustomContextAction {
  id: string;
  label: string;
  action: () => Promise<void>;
}

export const TableRow = ({
  isNewRow,
  children,
  onRemove,
  onAdd,
  customContextActions,
}: {
  isNewRow: boolean;
  children: (
    styles: {mainStyles: string; leftStyles: string},
    add: () => void
  ) => ReactNode;
  onRemove: () => Promise<void>;
  onAdd?: () => Promise<boolean>;
  customContextActions?: CustomContextAction[];
}) => {
  const [css, theme] = useFrostedStyletron();
  const tableStyles = getTableStyles(theme);
  const borderStyle = `1px solid ${theme.colors.primary500}`;
  const cellStyles = css({
    ...tableStyles.cell,
    borderTop: isNewRow ? borderStyle : '',
    borderBottom: isNewRow ? borderStyle : '',
  });
  const hoveredCellStyles = css({
    backgroundColor: theme.colors.primary200,
  });
  const iconHoverOverrides = {
    Svg: {style: {':hover': {color: theme.colors.primary, cursor: 'pointer'}}},
  };
  const leftCellStyles = isNewRow ? css({borderLeft: borderStyle}) : '';
  const rightCellStyles = isNewRow
    ? css({borderRight: borderStyle, paddingLeft: '0'})
    : css({paddingLeft: '0'});
  const addCellContainerStyles = css({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  });
  const addButtonStyles = css({
    color: theme.colors.primary,
    cursor: 'pointer',
    paddingTop: '3px',
  });

  const [isLoading, setLoading] = useState(false);
  const remove = async () => {
    setLoading(true);
    await onRemove();
  };
  const add = async () => {
    setLoading(true);
    if (!(await unwrap(onAdd)())) {
      setLoading(false);
    }
  };

  const isMounted = useMounted();
  const contextMenuItems = useMemo(
    () =>
      safeUnwrap(customContextActions, actions =>
        actions.map(a => ({
          id: a.id,
          label: a.label,
        }))
      ),
    [customContextActions]
  );
  const contextMenuOnItemSelect = useCallback(
    async selectedItem => {
      const contextAction = unwrap(customContextActions).find(
        i => i.id === selectedItem.id
      );
      if (!contextAction) {
        return;
      }
      setLoading(true);
      await contextAction.action();
      isMounted.current && setLoading(false);
    },
    [customContextActions]
  );

  const getContextActions = () => {
    if (!customContextActions) {
      return (
        <div onClick={async () => await remove()}>
          <Delete size={24} overrides={iconHoverOverrides} />
        </div>
      );
    }
    return (
      <MoreOptionsButton
        menuItems={contextMenuItems}
        onItemSelect={contextMenuOnItemSelect}
      >
        <div>
          <Overflow
            size={24}
            color="#B0AFAF"
            overrides={{Svg: {style: {cursor: 'pointer'}}}}
          />
        </div>
      </MoreOptionsButton>
    );
  };

  return (
    <HoverableDiv
      className={css({
        display: 'contents',
      })}
    >
      {isRowHovered => {
        const styles = isRowHovered
          ? `${cellStyles} ${hoveredCellStyles}`
          : cellStyles;

        return (
          <>
            {children({mainStyles: styles, leftStyles: leftCellStyles}, add)}
            <div
              className={`${styles} ${rightCellStyles}`}
              onClick={e => e.stopPropagation()}
            >
              {isLoading ? (
                <LoadingSpinner size="32px" />
              ) : isNewRow ? (
                <div className={addCellContainerStyles}>
                  <div onClick={async () => await remove()}>
                    <Delete
                      size={24}
                      color={theme.colors.primary}
                      overrides={iconHoverOverrides}
                    />
                  </div>
                  <div
                    onClick={async () => await add()}
                    className={addButtonStyles}
                  >
                    ADD
                  </div>
                </div>
              ) : isRowHovered ? (
                getContextActions()
              ) : null}
            </div>
          </>
        );
      }}
    </HoverableDiv>
  );
};
