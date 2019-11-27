/* global Intl */
import React from 'react';
import {EventSchema} from '../../data/schema-types';
import {useStyletron} from 'baseui';
import {ProgressBar} from 'baseui/progress-bar';
import moment from 'moment';

interface Props {
  event: EventSchema;
}

export const EventTile = ({event}: Props) => {
  const [css, theme] = useStyletron();
  const containerStyles = css({
    width: '244px',
    height: '232px',
    background: '#FFFFFF',
    borderRadius: '4px',
    borderTop: '1px solid #F6F4ED',
    borderRight: '1px solid #F6F4ED',
    borderBottom: '1px solid #F6F4ED',
    borderLeft: '4px solid #E2D4B6',
    boxShadow: '9px 17px 27px 0 #F6F4ED, 1px 0 1px 0 rgba(174,186,196,0.14)',
    display: 'flex',
    flexDirection: 'column',
    padding: '22px 32px',
  });
  const topSectionStyles = css({
    display: 'flex',
    justifyContent: 'space-between',
    flex: '0 0 40px',
  });
  const middleSectionStyles = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  });
  const bottomSectionStyles = css({
    flex: '0 0 40px',
  });

  return (
    <div className={containerStyles}>
      <div className={topSectionStyles}>
        <div>{moment(event.date).format('LL')}</div>
        <div>...</div>
      </div>
      <div className={middleSectionStyles}>
        <div>{event.name}</div>
        <div>
          <ProgressBar
            value={90}
            overrides={{
              BarProgress: {
                style: {
                  backgroundColor: theme.colors.primary,
                },
              },
            }}
          />
        </div>
      </div>
      <div className={bottomSectionStyles}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(event.budget)}
      </div>
    </div>
  );
};
