import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

import type {TimelineComponent} from '../home/TimelineConstants';
import {Routes} from '../navigation/NavigationUtilities';

import {MemoryDisplayView} from './MemoryDisplayView';
import type {Memory} from './MemoryModels';
import {getMemories} from './MemoryService';
import {selectAllMemories, storeMemories} from './store';

export const MemoryTimelineComponent = (): TimelineComponent<Memory> => ({
  fetch: getMemories,
  select: selectAllMemories,
  dispatcher: storeMemories,
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
