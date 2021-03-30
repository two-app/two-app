import {useNavigation} from '@react-navigation/native';
import React, {ReactElement, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch, useSelector} from 'react-redux';
import {PayloadActionCreator} from 'typesafe-actions';
import Animated, {Easing} from 'react-native-reanimated';

import Colors from '../Colors';
import {TouchableCard} from '../forms/Card';
import {ErrorResponse} from '../http/Response';
import {loading, LoadingStatus} from '../LoadingScreen';
import {TwoNav} from '../navigation/NavigationUtilities';
import {getNavigation} from '../navigation/RootNavigation';
import {persistor, TwoState} from '../state/reducers';
import {selectAllTags, storeTags} from '../tags/store';
import {Tag} from '../tags/Tag';
import {getTags} from '../tags/TagService';
import {MemoryDisplayView} from '../memories/MemoryDisplayView';
import {
  GridIcon,
  GroupedIcon,
  TimelineIcon,
} from '../memories/MemoryHeaderIcons';
import {Memory} from '../memories/MemoryModels';
import {getMemories} from '../memories/MemoryService';
import {selectAllMemories, storeMemories} from '../memories/store';

import {Heading} from './Heading';

type SelectedTimeline = 'timeline' | 'grouped' | 'grid';

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

type TimelineHeaderProps = {
  selected: SelectedTimeline;
  onSelected: (selected: SelectedTimeline) => void;
};

const TimelineHeader = ({selected, onSelected}: TimelineHeaderProps) => {
  const {navigate} = useNavigation<TwoNav>();

  return (
    <View style={{paddingVertical: 20}}>
      <TouchableCard onPress={() => navigate('SearchScreen')}>
        <EvilIcon
          name="search"
          style={{fontSize: 20, paddingRight: 10, color: Colors.REGULAR}}
        />
        <Text style={{color: Colors.REGULAR}}>Find memories...</Text>
      </TouchableCard>

      <Heading>Memories</Heading>

      <TouchableCard
        onPress={() => navigate('NewMemoryScreen')}
        style={{marginVertical: 20}}>
        <SimpleLineIcon
          name="pencil"
          style={{fontSize: 13, paddingRight: 10, color: Colors.REGULAR}}
        />
        <Text style={{color: Colors.REGULAR}}>Title of your new memory...</Text>
      </TouchableCard>

      <View style={{flexDirection: 'row'}}>
        <TimelineIcon
          focused={selected === 'timeline'}
          onPress={() => onSelected('timeline')}
        />
        <GroupedIcon
          focused={selected === 'grouped'}
          onPress={() => onSelected('grouped')}
        />
        <GridIcon
          focused={selected === 'grid'}
          onPress={() => onSelected('grid')}
        />
      </View>
    </View>
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

const RenderWrapper = ({children}: {children: React.ReactNode}) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
    }).start();

    return () => {
      console.log('end');
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
      }).start();
    };
  }, []);

  return <Animated.View style={{opacity: opacity}}>{children}</Animated.View>;
};
