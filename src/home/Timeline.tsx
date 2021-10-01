import { useEffect, useState } from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Animated from 'react-native-reanimated';

import type {ErrorResponse} from '../http/Response';
import type {LoadingStatus} from '../LoadingScreen';
import {loading} from '../LoadingScreen';
import {persistor} from '../state/reducers';

import type {TimelineType} from './TimelineConstants';
import {setOpacityFn, Timelines} from './TimelineConstants';
import {TimelineHeader} from './TimelineHeader';

export const Timeline = () => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(loading);
  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineType>('timeline');

  const [opacity] = useState(new Animated.Value(0));
  const setOpacity = setOpacityFn(opacity);
  const dispatch = useDispatch();
  const timeline = Timelines()[selectedTimeline];

  const refreshData = (displayRefresh?: boolean) => {
    setLoadingStatus(loadingStatus.beginLoading(displayRefresh));
    timeline
      .fetch()
      .then(data => {
        dispatch(timeline.dispatcher(data));
        persistor.persist();
        setLoadingStatus(loadingStatus.endLoading());
      })
      .catch((e: ErrorResponse) => {
        setLoadingStatus(loadingStatus.endLoading(e.reason));
      });
  };

  useEffect(() => {
    refreshData();
    setOpacity(1).start();
  }, [selectedTimeline]);

  const data = useSelector(timeline.select);
  return (
    <FlatList
      data={data}
      accessibilityLabel={`Selected timeline: ${selectedTimeline}`}
      accessibilityHint={`Timeline ${selectedTimeline} with ${data.length} items`}
      ListHeaderComponent={() => (
        <TimelineHeader
          selected={selectedTimeline}
          onSelected={selected => {
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
      keyExtractor={item => timeline.key(item)}
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
