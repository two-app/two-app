import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Memory} from '../MemoryModels';
import {MemoryDisplayView} from '../MemoryDisplayView';
import Icon from 'react-native-vector-icons/AntDesign';

import _ from 'lodash';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getNavigation} from '../../navigation/RootNavigation';
import Colors from '../../Colors';

export const MemoryToolbar = ({memory}: {memory: Memory}) => (
  <View>
    <View style={styles.toolbar}>
      <BackButton />
      <View style={styles.toolbarGroup}>
        <EditButton memory={memory} />
        <UploadContentButton />
      </View>
    </View>
    <MemoryDisplayView memory={memory} />
  </View>
);

const BackButton = () => (
  <TouchableOpacity
    accessibilityLabel="Go Back"
    onPress={() => getNavigation().navigate('HomeScreen')}>
    <Icon name="arrowleft" size={25} color={Colors.DARK} />
  </TouchableOpacity>
);

const EditButton = ({memory}: {memory: Memory}) => (
  <TouchableOpacity
    style={styles.icon}
    onPress={() => getNavigation().navigate('EditMemoryScreen', {memory})}>
    <Icon name="edit" size={25} color={Colors.DARK} />
  </TouchableOpacity>
);

const UploadContentButton = () => (
  <TouchableOpacity accessibilityLabel="Upload Content" style={styles.icon}>
    <Icon name="plussquareo" size={25} color={Colors.DARK} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 15,
  },
});
