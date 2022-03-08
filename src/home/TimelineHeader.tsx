import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Colors from '../Colors';
import {TouchableCard} from '../forms/Card';
import {
  TimelineIcon,
  GroupedIcon,
  GridIcon,
} from '../memories/MemoryHeaderIcons';
import {Routes} from '../navigation/NavigationUtilities';
import { Timeline } from '../timelines/UseTimelineHook';

import {Heading} from './Heading';

export type TimelineHeaderProps = {
  selected: Timeline;
  onSelected: (selected: Timeline) => void;
};

export const TimelineHeader = ({selected, onSelected}: TimelineHeaderProps) => {
  const {navigate} = useNavigation<Routes>();

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
        a11={{accessibilityLabel: 'Create a new memory'}}
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
