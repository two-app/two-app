import {AlertButton, TouchableOpacity} from 'react-native';
import {View, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {CommonActions, useNavigation} from '@react-navigation/native';

import {MemoryDisplayView} from '../MemoryDisplayView';
import type {Memory} from '../MemoryModels';
import Colors from '../../Colors';
import {ContentPicker} from '../../content/ContentPicker';
import {deleteMemory} from '../MemoryService';
import {Routes} from '../../navigation/NavigationUtilities';
import {useMemoryStore} from '../MemoryStore';

export const MemoryToolbar = ({memory}: {memory: Memory}) => (
  <View style={{marginBottom: 10}}>
    <View style={styles.toolbar}>
      <BackButton />
      <View style={styles.toolbarGroup}>
        <EditButton memory={memory} />
        <UploadContentButton memory={memory} />
        <DeleteMemoryButton memory={memory} />
      </View>
    </View>
    <MemoryDisplayView memory={memory} />
  </View>
);

const BackButton = () => {
  const {navigate} = useNavigation<Routes>();
  return (
    <TouchableOpacity
      accessibilityLabel="Go Back"
      onPress={() => navigate('HomeScreen')}>
      <Icon name="arrowleft" size={25} color={Colors.DARK} />
    </TouchableOpacity>
  );
};

const EditButton = ({memory}: {memory: Memory}) => {
  const {navigate} = useNavigation<Routes>();
  return (
    <TouchableOpacity
      accessibilityLabel="Edit Memory"
      style={styles.icon}
      onPress={() => navigate('EditMemoryScreen', {mid: memory.mid})}>
      <Icon name="edit" size={25} color={Colors.DARK} />
    </TouchableOpacity>
  );
};

export const UploadContentButton = ({memory}: {memory: Memory}) => {
  return (
    <TouchableOpacity
      accessibilityLabel="Upload Content"
      style={styles.icon}
      onPress={() => ContentPicker.open(memory.mid)}>
      <Icon name="plussquareo" size={25} color={Colors.DARK} />
    </TouchableOpacity>
  );
};

export const DeleteMemoryButton = ({memory}: {memory: Memory}) => {
  const nav = useNavigation();
  const memoryStore = useMemoryStore();

  let message = `Delete '${memory.title}'`;
  if (memory.imageCount + memory.videoCount > 0) {
    message = `Deleting '${memory.title}' will permanently delete the enclosed pictures and videos.`;
  }

  const onPress = (): void => {
    const cancelBtn: AlertButton = {text: 'Cancel', style: 'cancel'};
    const deleteBtn: AlertButton = {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        await deleteMemory(memory.mid);

        nav.dispatch(
          // reset as state will no longer exist
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
          }),
        );

        memoryStore.remove(memory.mid);
      },
    };

    Alert.alert('Delete Memory', message, [cancelBtn, deleteBtn]);
  };

  return (
    <TouchableOpacity
      accessibilityLabel="Delete Memory"
      // if only the icon was clipped correctly...
      style={{marginLeft: 8, marginRight: -8}}
      onPress={onPress}>
      <EvilIcon name="trash" size={36} color={Colors.DARK_SALMON} />
    </TouchableOpacity>
  );
};

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
