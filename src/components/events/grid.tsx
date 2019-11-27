import React from 'react';
import {EventTile} from './tile';
import {EventSchema} from '../../data/schema-types';
import {useStyletron} from 'baseui';

interface Props {
  events: EventSchema[];
}
export const EventsGrid = ({events}: Props) => {
  const [css, theme] = useStyletron();
  const containerStyles = css({
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
    marginTop: theme.sizing.scale900,
  });
  const tileStyles = css({
    marginRight: theme.sizing.scale800,
    marginBottom: theme.sizing.scale800,
  });
  return (
    <div className={containerStyles}>
      {events.map(event => (
        <div key={event.id} className={tileStyles}>
          <EventTile event={event} />
        </div>
      ))}
    </div>
  );
};
