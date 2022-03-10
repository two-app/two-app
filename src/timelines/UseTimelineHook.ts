import {ReactElement, useEffect, useState} from 'react';
import {ListRenderItem} from 'react-native';
import {UseBoundStore} from 'zustand';
import {MemoryTimelineComponent} from '../memories/MemoryTimeline';
import {GroupedTimelineComponent} from '../tags/TagTimeline';

export type Timeline = 'timeline' | 'grouped' | 'grid';

export type TimelineDataStore<T> = {
  all: T[];
  setAll: (t: T[]) => void;
};

export type TimelineComponent<Item extends object, State extends object> = {
  fetch: () => Promise<Array<Item>>;
  useStore: UseBoundStore<State>;
  render: (item: Item) => ReactElement;
  key: (item: Item) => string;
};

const timelines: Record<Timeline, () => TimelineComponent<any, any>> = {
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

type ManagedComponentState = {
  comp: TimelineComponent<any, any>;
  data: any[];
};

export const useTimeline = (initialTimeline: Timeline): UseTimelineHook => {
  const [timeline, setTimeline] = useState(initialTimeline);
  const [{comp, data}, setCompData] = useState<ManagedComponentState>({
    comp: timelines[timeline](),
    data: [],
  });

  const createRefresh = (component: TimelineComponent<any, any>) => {
    return () =>
      component.fetch().then(data => setCompData({comp: component, data}));
  };

  useEffect(() => {
    // synchronously set the component + empty cached data while we load
    const comp = timelines[timeline]();
    const data = comp.useStore.getState().all;
    setCompData({comp, data});

    // asynchronously retrieve the updated data
    comp.fetch().then(data => {
      comp.useStore.setState({all: data});
      setCompData({comp, data});
    });
  }, [timeline]);

  return [
    data,
    createRefresh(comp),
    timeline,
    setTimeline,
    comp.render,
    comp.key,
  ];
};
