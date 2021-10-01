import {Alert, AlertButton, StyleProp, ViewStyle} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import pluralize from 'pluralize';

import {Tag} from '../Tag';
import {deleteTag} from '../TagService';
import Colors from '../../Colors';

type DeleteTagIconProps = {
  tag: Tag;
  onDeleted: () => void;
  style?: StyleProp<ViewStyle>;
};

export const DeleteTagIcon = ({tag, onDeleted, style}: DeleteTagIconProps) => {
  const onPress = () => {
    let message = `Delete '${tag.name}' tag`;
    if (tag.memoryCount > 0) {
      const pluralized = pluralize('memory', tag.memoryCount, true);
      message = `Deleting '${tag.name}' will remove it from ${pluralized}`;
    }

    const cancelBtn: AlertButton = {text: 'Cancel', style: 'cancel'};
    const deleteBtn: AlertButton = {
      text: 'Delete',
      style: 'destructive',
      onPress: () => {
        deleteTag(tag.tid).then(onDeleted);
      },
    };

    Alert.alert('Delete Tag', message, [cancelBtn, deleteBtn]);
  };
  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      accessibilityLabel="Delete Tag"
      accessibilityHint={`Delete Tag '${tag.name}'`}
    >
      <EvilIcon
        name="trash"
        style={{fontSize: 32, color: Colors.DARK_SALMON}}
      />
    </TouchableOpacity>
  );
};
