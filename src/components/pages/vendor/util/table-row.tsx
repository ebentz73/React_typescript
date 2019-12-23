import React, {ReactNode, useState} from 'react';
import {HoverableDiv} from '../../../common/util';
import {
  useFrostedStyletron,
  getTableStyles,
  LoadingSpinner,
} from '../../../util';
import {DeleteAlt, Plus} from 'baseui/icon';
import {unwrap} from '../../../../util';

export const TableRow = ({
  isNewRow,
  children,
  onRemove,
  onAdd,
}: {
  isNewRow: boolean;
  children: (
    styles: {mainStyles: string; leftStyles: string},
    add: () => void
  ) => ReactNode;
  onRemove: () => Promise<void>;
  onAdd?: () => Promise<boolean>;
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
                <div className={css({display: 'flex'})}>
                  <div onClick={async () => await remove()}>
                    <DeleteAlt
                      size={24}
                      color={theme.colors.primary}
                      overrides={iconHoverOverrides}
                    />
                  </div>
                  <div onClick={async () => await add()}>
                    <Plus
                      size={24}
                      color={theme.colors.primary}
                      overrides={iconHoverOverrides}
                    />
                  </div>
                </div>
              ) : isRowHovered ? (
                <div onClick={async () => await remove()}>
                  <DeleteAlt size={24} overrides={iconHoverOverrides} />
                </div>
              ) : null}
            </div>
          </>
        );
      }}
    </HoverableDiv>
  );
};
