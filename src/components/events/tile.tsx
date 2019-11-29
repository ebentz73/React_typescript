/* global Intl */
import React from 'react';
import {EventSchema} from '../../data/schema-types';
import {useStyletron} from 'baseui';
import {ProgressBar} from 'baseui/progress-bar';
import moment from 'moment';
import {withRouter, RouteComponentProps} from 'react-router';
import {RoutePaths} from '../../constants';
import {StatefulPopover, PLACEMENT} from 'baseui/popover';
import {StatefulMenu} from 'baseui/menu';
import {Overflow} from 'baseui/icon';
import {StyledRouterLink} from '../util';

interface Props {
  event: EventSchema;
}

export const EventTile = ({event, history}: Props & RouteComponentProps) => {
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
    color: '#0B0C0E',
    ...theme.typography.font100,
  });

  const menuItems = [{label: 'View'}, {label: 'Edit'}, {label: 'Archive'}];
  const renderMenu = close => (
    <StatefulMenu
      items={menuItems}
      overrides={{
        List: {
          style: {
            backgroundColor: '#1F2532',
            borderRadius: '4px',
            outline: 'none',
          },
        },
        Option: {style: {backgroundColor: '#1F2532', color: '#FFFFFF'}},
      }}
      onItemSelect={() => {
        history.push(RoutePaths.Event(event.id));
        close();
      }}
    />
  );

  return (
    <div className={containerStyles}>
      <div className={topSectionStyles}>
        <div className={css({...theme.typography.font200, color: '#1E1E1C'})}>
          {moment(event.date).format("D MMM 'YY")}
        </div>
        <div>
          <StatefulPopover
            placement={PLACEMENT.bottomRight}
            content={({close}) => renderMenu(close)}
          >
            <div>
              <Overflow
                size={24}
                color="#B0AFAF"
                overrides={{Svg: {style: {cursor: 'pointer'}}}}
              />
            </div>
          </StatefulPopover>
        </div>
      </div>
      <div className={middleSectionStyles}>
        <div className={css({...theme.typography.font300, color: '#0B0C0E'})}>
          <StyledRouterLink to={RoutePaths.Event(event.id)}>
            {event.name}
          </StyledRouterLink>
        </div>
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

export default withRouter(EventTile);
