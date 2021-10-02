import type {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

import type {RootStackParamList} from '../../Router';
import type {TimelineComponent} from '../home/TimelineConstants';

import {MemoryDisplayView} from './MemoryDisplayView';
import type {Memory} from './MemoryModels';
import {getMemories} from './MemoryService';
import {selectAllMemories, storeMemories} from './store';

export const MemoryTimelineComponent = (): TimelineComponent<Memory> => ({
  fetch: getMemories,
  select: selectAllMemories,
  dispatcher: storeMemories,
  render: memory => <MemoryItem memory={memory} />,
  key: memory => `memory-${memory.id}`,
});

type NavProp = NavigationProp<RootStackParamList, 'HomeScreen'>;

const MemoryItem = ({memory}: {memory: Memory}) => {
  const {navigate} = useNavigation<NavProp>();
  return (
    <TouchableOpacity
      accessibilityLabel={`Open memory '${memory.title}'`}
      style={{marginTop: 10, marginBottom: 20}}
      onPress={() => navigate('MemoryScreen', {mid: memory.id})}
    >
      <MemoryDisplayView memory={memory} />
    </TouchableOpacity>
  );
};
