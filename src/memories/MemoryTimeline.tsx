import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import {TimelineComponent} from '../home/TimelineConstants';

import {MemoryDisplayView} from './MemoryDisplayView';
import {Memory} from './MemoryModels';
import {getMemories} from './MemoryService';
import {selectAllMemories, storeMemories} from './store';

export const MemoryTimelineComponent = (): TimelineComponent<Memory> => ({
  fetch: getMemories,
  select: selectAllMemories,
  dispatcher: storeMemories,
  render: (memory) => <MemoryItem memory={memory} />,
  key: (memory) => `memory-${memory.id}`,
});

const MemoryItem = ({memory}: {memory: Memory}) => {
  const {navigate} = useNavigation();
  return (
    <TouchableOpacity
      accessibilityLabel={`Open memory '${memory.title}'`}
      style={{marginTop: 10, marginBottom: 20}}
      onPress={() => navigate('MemoryScreen', {mid: memory.id})}>
      <MemoryDisplayView memory={memory} />
    </TouchableOpacity>
  );
};
