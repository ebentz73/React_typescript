import moment from 'moment';
import {createPlugin, createToken, ServiceType} from 'fusion-core';
import {TimelineItemModelToken} from '../models/timeline-item';
import {TimelineSnippetModelToken} from '../models/timeline-snippet';
import {unwrap} from '../../util';

export const TimelineItemService = createPlugin({
  deps: {
    TimelineItemModel: TimelineItemModelToken,
    TimelineSnippetModel: TimelineSnippetModelToken,
  },
  provides: ({TimelineItemModel, TimelineSnippetModel}) => {
    const shiftOneTimeline = (timelineId, minToShift) =>
      TimelineItemModel.findById(timelineId).then(t => {
        const timeline = unwrap(t);
        const startingTime = `${timeline.date} ${timeline.startTime}`;
        const currentTimeStamp = moment(
          startingTime,
          'MM/DD/YY hh:mm A'
        ).format('X');
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

    return {
      timeShift(timelineIds, minToShift) {
        return Promise.all(
          timelineIds.map(timelineId =>
            shiftOneTimeline(timelineId, minToShift)
          )
        );
      },
      bulkDelete(event, timelineIds) {
        return Promise.all(
          timelineIds.map(timelineId => {
            event.timelineItems.pull(timelineId);
            return TimelineItemModel.findByIdAndDelete(timelineId);
          })
        ).then(() => event.save());
      },
      readSnippets() {
        return TimelineSnippetModel.find();
      },
      addSnippet(timelineIds, title) {
        const newSnippet = new TimelineSnippetModel({
          name: title,
          timelineItems: timelineIds,
        });

        return newSnippet.save();
      },
    };
  },
});
export const TimelineItemServiceToken = createToken<
  ServiceType<typeof TimelineItemService>
>('TimelineItemService');
