import {ReactElement, useEffect, useState} from 'react';
import {ListRenderItem} from 'react-native';
import { UseBoundStore } from 'zustand';
import {MemoryTimelineComponent} from '../memories/MemoryTimeline';
import {GroupedTimelineComponent} from '../tags/TagTimeline';

export type Timeline = 'timeline' | 'grouped' | 'grid';

export type TimelineDataStore<T> = {
  all: T[];
  setAll: (t: T[]) => void;
};

export type TimelineComponent<Item extends object, State extends object> = {
  fetch: () => Promise<Array<Item>>;
  store: UseBoundStore<State>;
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

export const useTimeline = (initialTimeline: Timeline): UseTimelineHook => {
  const [timeline, setTimeline] = useState(initialTimeline);
  const component = timelines[timeline]();
  const {store} = component;

  // Listen for changes in Zustand state, storing it as React state
  const [data, setData] = useState(store.getState().all);
  store.subscribe(state => setData(state.all));
  
  const fetch = () => component.fetch().then(data => store.getState().setAll(data));

  useEffect(() => {
      fetch(); // perform initial lookup
  }, [timeline]);

  return [
    data,
    fetch,
    timeline,
    setTimeline,
    component.render,
    component.key,
  ];
};
