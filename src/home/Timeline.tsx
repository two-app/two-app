import React, {ReactElement, useEffect, useState} from 'react';
import {FlatList, RefreshControl, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {PayloadActionCreator} from 'typesafe-actions';
import Animated, {Easing} from 'react-native-reanimated';

import {ErrorResponse} from '../http/Response';
import {loading, LoadingStatus} from '../LoadingScreen';
import {getNavigation} from '../navigation/RootNavigation';
import {persistor, TwoState} from '../state/reducers';
import {selectAllTags, storeTags} from '../tags/store';
import {Tag} from '../tags/Tag';
import {getTags} from '../tags/TagService';
import {MemoryDisplayView} from '../memories/MemoryDisplayView';
import {Memory} from '../memories/MemoryModels';
import {getMemories} from '../memories/MemoryService';
import {selectAllMemories, storeMemories} from '../memories/store';

import {SelectedTimeline} from './TimelineConstants';
import {TimelineHeader} from './TimelineHeader';

export const Timeline = () => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(loading);
  const [selectedTimeline, setSelectedTimeline] = useState<SelectedTimeline>(
    'timeline',
  );

  const [opacity] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const timeline = Timelines[selectedTimeline];

  const refreshData = (displayRefresh?: boolean) => {
    setLoadingStatus(loadingStatus.beginLoading(displayRefresh));
    timeline
      .fetch()
      .then((data) => {
        dispatch(timeline.dispatcher(data));
        persistor.persist();
        setLoadingStatus(loadingStatus.endLoading());
      })
      .catch((e: ErrorResponse) => {
        setLoadingStatus(loadingStatus.endLoading(e.reason));
      });
  };

  const setOpacity = (toValue: number) =>
    Animated.timing(opacity, {
      toValue,
      duration: 100,
      easing: Easing.ease,
    });

  useEffect(() => {
    refreshData();
    setOpacity(1).start();
  }, []);

  return (
    <FlatList
      data={useSelector(timeline.select)}
      ListHeaderComponent={() => (
        <TimelineHeader
          selected={selectedTimeline}
          onSelected={(selected) => {
            setOpacity(0).start(() => {
              setSelectedTimeline(selected);
              setOpacity(1).start();
            });
          }}
        />
      )}
      renderItem={({item}) => (
        <Animated.View style={{opacity: opacity}}>
          {timeline.render(item)}
        </Animated.View>
      )}
      keyExtractor={(item) => timeline.key(item)}
      refreshControl={
        <RefreshControl
          colors={['#9Bd35A', '#689F38']}
          refreshing={loadingStatus.displayRefresh}
          onRefresh={() => {
            refreshData(true);
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

type TimelineComponent<T> = {
  fetch: () => Promise<Array<T>>;
  select: (s: TwoState) => Array<T>;
  dispatcher: PayloadActionCreator<string, Array<T>>;
  render: (item: T) => ReactElement;
  key: (item: T) => string;
};

const MemoryTimelineComponent: TimelineComponent<Memory> = {
  fetch: getMemories,
  select: selectAllMemories,
  dispatcher: storeMemories,
  render: (memory) => <MemoryItem memory={memory} />,
  key: (memory) => `memory-${memory.id}`,
};

const MemoryItem = ({memory}: {memory: Memory}) => (
  <TouchableOpacity
    style={{marginTop: 10, marginBottom: 20}}
    onPress={() => getNavigation().navigate('MemoryScreen', {mid: memory.id})}>
    <MemoryDisplayView memory={memory} />
  </TouchableOpacity>
);

const GroupedTimelineComponent: TimelineComponent<Tag> = {
  fetch: getTags,
  select: selectAllTags,
  dispatcher: storeTags,
  render: (tag) => <TagItem tag={tag} />,
  key: (tag) => `tag-${tag.tid}`,
};

const TagItem = ({tag}: {tag: Tag}) => (
  <TouchableOpacity style={{marginVertical: 20}}>
    <Text>{tag.name}</Text>
  </TouchableOpacity>
);

const Timelines: Record<SelectedTimeline, TimelineComponent<any>> = {
  timeline: MemoryTimelineComponent,
  grouped: GroupedTimelineComponent,
  grid: MemoryTimelineComponent,
};
