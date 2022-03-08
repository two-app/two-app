import {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';

import {useTimeline} from '../timelines/UseTimelineHook';

import {TimelineHeader} from './TimelineHeader';

export const Timeline = () => {
  const [data, refresh, timeline, setTimeline, render, key] =
    useTimeline('timeline');
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={data}
      accessibilityLabel={`Selected timeline: ${timeline}`}
      accessibilityHint={`Timeline ${timeline} with ${data.length} items`}
      ListHeaderComponent={() => (
        <TimelineHeader selected={timeline} onSelected={setTimeline} />
      )}
      renderItem={({item}) => render(item)}
      keyExtractor={key}
      refreshControl={
        <RefreshControl
          colors={['#9Bd35A', '#689F38']}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            refresh().finally(() => setRefreshing(false));
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};
