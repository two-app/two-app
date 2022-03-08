import {useState} from 'react';
import {ListRenderItem} from 'react-native';
import {TimelineComponent} from '../home/TimelineConstants';
import {MemoryTimelineComponent} from '../memories/MemoryTimeline';
import {GroupedTimelineComponent} from '../tags/TagTimeline';

type Timeline = 'timeline' | 'grouped' | 'grid';

const timelines: Record<Timeline, () => TimelineComponent<any>> = {
  timeline: MemoryTimelineComponent,
  grouped: GroupedTimelineComponent,
  grid: MemoryTimelineComponent,
};

type UseTimelineHook = [
  // data - array resolved from timeline's fetch()
  any[],
  // refresh - force a data refresh for the timeline
  () => Promise<void>,
  // timeline - the currently selected timeline
  Timeline,
  // setTimeline - function to configure which timeline is used
  React.Dispatch<React.SetStateAction<Timeline>>,
  // renderItem - function to render a given item in the components style
  ListRenderItem<any>,
  // keyExtractor - function to calculate a key for the given item
  (item: any) => string,
];

export const useTimeline = (initialTimeline: Timeline): UseTimelineHook => {
  const [timeline, setTimeline] = useState(initialTimeline);
  const component = timelines[timeline]();
  const store = component.store();

  const fetch = () => component.fetch().then(store.setAll);

  return [
    store.all,
    fetch,
    timeline,
    setTimeline,
    component.render,
    component.key,
  ];
};
