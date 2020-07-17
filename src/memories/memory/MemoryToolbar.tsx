import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {MemoryDisplayView} from '../MemoryDisplayView';
import {Memory} from '../MemoryModels';
import {getNavigation} from '../../navigation/RootNavigation';
import Colors from '../../Colors';
import {ContentPicker, PickedContent} from '../../content/ContentPicker';

export const MemoryToolbar = ({memory}: {memory: Memory}) => (
  <View>
    <View style={styles.toolbar}>
      <BackButton />
      <View style={styles.toolbarGroup}>
        <EditButton memory={memory} />
        <UploadContentButton memory={memory} />
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
    onPress={() =>
      getNavigation().navigate('EditMemoryScreen', {mid: memory.id})
    }>
    <Icon name="edit" size={25} color={Colors.DARK} />
  </TouchableOpacity>
);

export const UploadContentButton = ({memory}: {memory: Memory}) => (
  <TouchableOpacity
    accessibilityLabel="Upload Content"
    style={styles.icon}
    onPress={() => {
      ContentPicker.open(
        () => {},
        (content: PickedContent[]) => {
          if (memory.displayContent == null) {
            // select first item as display picture
            content[0].setDisplayPicture = true;
          }

          getNavigation().navigate('ContentUploadScreen', {
            mid: memory.id,
            content,
          });
        },
      );
    }}>
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
