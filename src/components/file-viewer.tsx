import React from 'react';
import {useFrostedStyletron} from './util';
import {Delete} from 'baseui/icon';

export const FileViewer = ({onClose}: {onClose: () => void}) => {
  const [css, theme] = useFrostedStyletron();
  const containerStyles = css({
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingTop: '50px',
  });
  const titleStyles = css({
    ...theme.typography.font400,
  });
  return (
    <div className={containerStyles}>
      <div className={css({display: 'flex', justifyContent: 'space-between'})}>
        <div className={titleStyles}>ContractName.pdf</div>
        <div onClick={onClose}>
          <Delete
            size={32}
            overrides={{
              Svg: {
                style: {
                  cursor: 'pointer',
                  ':hover': {
                    color: theme.colors.primary,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
