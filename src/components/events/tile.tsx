/* global Intl */
import React, {useState, useContext} from 'react';
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
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import {EventsContext} from './context';

interface Props {
  event: EventSchema;
}

export const EventTile = ({event, history}: Props & RouteComponentProps) => {
  const {isArchived} = event;

  const [css, theme] = useStyletron();
  const containerStyles = css({
    width: '244px',
    height: '232px',
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #F6F4ED',
    borderRight: '1px solid #F6F4ED',
    borderBottom: '1px solid #F6F4ED',
    display: 'flex',
    flexDirection: 'column',
    padding: '22px 32px',
    ...(isArchived
      ? {
          borderLeft: '4px solid #B0AFAF',
          boxShadow: '1px 0 1px 0 rgba(174,186,196,0.14)',
        }
      : {
          borderLeft: '4px solid #E2D4B6',
          boxShadow:
            '9px 17px 27px 0 #F6F4ED, 1px 0 1px 0 rgba(174,186,196,0.14)',
        }),
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

  const [isArchiving, setIsArchiving] = useState(false);
  const {
    actions: {archiveEvent},
  } = useContext(EventsContext);

  const menuItems = [
    {label: 'View'},
    {label: 'Edit'},
    {label: isArchived ? 'Unarchive' : 'Archive'},
  ];
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
      onItemSelect={e => {
        if (e.item.label === 'Archive') {
          setIsArchiving(true);
        } else if (e.item.label === 'Unarchive') {
          archiveEvent(event.id, false);
        } else {
          history.push(RoutePaths.Event(event.id));
        }
        close();
      }}
    />
  );

  return (
    <>
      <Modal
        onClose={() => setIsArchiving(false)}
        closeable
        isOpen={isArchiving}
        animate
      >
        <ModalHeader>Archive event?</ModalHeader>
        <ModalBody>Are you sure you want to archive this event?</ModalBody>
        <ModalFooter>
          <ModalButton onClick={() => setIsArchiving(false)}>
            Cancel
          </ModalButton>
          <ModalButton
            onClick={() => {
              archiveEvent(event.id, true);
              setIsArchiving(false);
            }}
          >
            Archive
          </ModalButton>
        </ModalFooter>
      </Modal>
      <div className={containerStyles}>
        <div className={topSectionStyles}>
          <div
            className={css({
              ...theme.typography.font200,
              color: isArchived ? 'B0AFAF' : '#1E1E1C',
            })}
          >
            {isArchived ? 'ARCHIVED' : moment(event.date).format("D MMM 'YY")}
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
              value={isArchived ? 0 : 70}
              overrides={{
                BarProgress: {
                  style: {
                    backgroundColor: isArchived
                      ? '#F3F2F2'
                      : theme.colors.primary,
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
    </>
  );
};

export default withRouter(EventTile);
