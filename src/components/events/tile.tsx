/* global Intl */
import React, {useState, useContext, useMemo, useCallback} from 'react';
import {EventSchema} from '../../data/schema-types';
import {ProgressBar} from 'baseui/progress-bar';
import moment from 'moment';
import {withRouter, RouteComponentProps} from 'react-router';
import {RoutePaths} from '../../constants';
import {Overflow} from 'baseui/icon';
import {
  StyledRouterLink,
  useFrostedStyletron,
  MoreOptionsButton,
} from '../util';
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

  const [css, theme] = useFrostedStyletron();
  const containerStyles = css({
    width: '194px',
    height: '218px',
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
          boxShadow: '1px 0 1px 0 rgba(174,186,196,0.5)',
        }
      : {
          borderLeft: '4px solid #E2D4B6',
          boxShadow:
            '9px 17px 27px 0 #F6F4ED, 1px 0 1px 0 rgba(174,186,196,0.5)',
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
    ...theme.eventTotalBudgetFont,
  });

  const [isArchiving, setIsArchiving] = useState(false);
  const {
    actions: {archiveEvent},
  } = useContext(EventsContext);

  const menuItems = useMemo(
    () => [
      {label: 'View'},
      {label: 'Edit'},
      {label: isArchived ? 'Unarchive' : 'Archive'},
    ],
    [isArchived]
  );
  const onMenuItemSelect = useCallback(
    item => {
      if (item.label === 'Archive') {
        setIsArchiving(true);
      } else if (item.label === 'Unarchive') {
        archiveEvent(event.id, false);
      } else {
        history.push(RoutePaths.Event(event.id));
      }
    },
    [event]
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
              ...theme.eventDateFont,
              color: isArchived ? 'B0AFAF' : '#1E1E1C',
            })}
          >
            {isArchived ? 'ARCHIVED' : moment(event.date).format("D MMM 'YY")}
          </div>
          <MoreOptionsButton
            menuItems={menuItems}
            onItemSelect={onMenuItemSelect}
          >
            <div>
              <Overflow
                size={24}
                color="#B0AFAF"
                overrides={{Svg: {style: {cursor: 'pointer'}}}}
              />
            </div>
          </MoreOptionsButton>
        </div>
        <div className={middleSectionStyles}>
          <div className={css({...theme.eventTitleFont, color: '#0B0C0E'})}>
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
