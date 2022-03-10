import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

import {Routes} from '../navigation/NavigationUtilities';
import {TimelineComponent} from '../timelines/UseTimelineHook';

import {MemoryDisplayView} from './MemoryDisplayView';
import type {Memory} from './MemoryModels';
import {getMemories} from './MemoryService';
import {MemoryState, useMemoryStore} from './MemoryStore';

export const MemoryTimelineComponent = (): TimelineComponent<
  Memory,
  MemoryState
> => ({
  fetch: getMemories,
  useStore: useMemoryStore,
  render: memory => <MemoryItem memory={memory} />,
  key: memory => `memory-${memory.mid}`,
});

const MemoryItem = ({memory}: {memory: Memory}) => {
  const {navigate} = useNavigation<Routes>();
  return (
    <TouchableOpacity
      accessibilityLabel={`Open memory '${memory.title}'`}
      style={{marginTop: 10, marginBottom: 20}}
      onPress={() => navigate('MemoryScreen', {mid: memory.mid})}>
      <MemoryDisplayView memory={memory} />
    </TouchableOpacity>
  );
};
