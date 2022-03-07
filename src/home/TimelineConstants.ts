import {ReactElement} from 'react';
import Animated, {EasingNode} from 'react-native-reanimated';

import {MemoryTimelineComponent} from '../memories/MemoryTimeline';
import {GroupedTimelineComponent} from '../tags/TagTimeline';

export type TimelineType = 'timeline' | 'grouped' | 'grid';

export type TimelineDataStore<T> = {
  all: T[];
  setAll: (t: T[]) => void;
};

export type TimelineComponent<T> = {
  fetch: () => Promise<Array<T>>;
  store: () => TimelineDataStore<T>;
  render: (item: T) => ReactElement;
  key: (item: T) => string;
};

export const Timelines = (): Record<TimelineType, TimelineComponent<any>> => ({
  timeline: MemoryTimelineComponent(),
  grouped: GroupedTimelineComponent(),
  grid: MemoryTimelineComponent(),
});

type SetOpacity = (toValue: number) => Animated.BackwardCompatibleWrapper;

/**
 * @returns a pre-configured timing animation, used to soothe the timeline
 * flat list when swapping between timeline components
 */
export const setOpacityFn = (ref: Animated.Node<number>): SetOpacity => {
  return (toValue: number) => {
    return Animated.timing(ref, {
      toValue,
      duration: 100,
      easing: EasingNode.ease,
    });
  };
};
