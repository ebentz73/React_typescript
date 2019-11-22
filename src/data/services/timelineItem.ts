import moment from 'moment';
import {TimelineItem} from '../models/timeline-item';
import {TimelineSnippet} from '../models/timeline-snippet';

function shiftOneTimeline(timelineId, minToShift) {
  return TimelineItem.findById(timelineId).then(timeline => {
    const startingTime = `${timeline.date} ${timeline.startTime}`;
    const currentTimeStamp = moment(startingTime, 'MM/DD/YY hh:mm A').format(
      'X'
    );
    const shiftedTimeStamp = Number(currentTimeStamp) + minToShift * 60;
    const parsedDate = moment(shiftedTimeStamp * 1000).format(
      'MM/DD/YY hh:mm A'
    );
    const shiftedDate = parsedDate.split(' ')[0];
    const shiftedStartTime = parsedDate.replace(shiftedDate, '');

    timeline.date = shiftedDate;
    timeline.startTime = shiftedStartTime;

    return timeline.save();
  });
}

export function timeShift(timelineIds, minToShift) {
  return Promise.all(
    timelineIds.map(timelineId => shiftOneTimeline(timelineId, minToShift))
  );
}

export function bulkDelete(event, timelineIds) {
  return Promise.all(
    timelineIds.map(timelineId => {
      event.timelineItems.pull(timelineId);
      return TimelineItem.findByIdAndDelete(timelineId);
    })
  ).then(() => event.save());
}

export function readSnippets() {
  return TimelineSnippet.find();
}

export function addSnippet(timelineIds, title) {
  const newSnippet = new TimelineSnippet({
    name: title,
    timelineItems: timelineIds,
  });

  return newSnippet.save();
}
