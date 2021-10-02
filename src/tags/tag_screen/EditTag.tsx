import {StyleProp, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Colors from '../../Colors';
import {getNavigation} from '../../navigation/RootNavigation';
import {Tag} from '../Tag';

type EditTagIconProps = {
  tag: Tag;
  onUpdated: () => void;
  style?: StyleProp<ViewStyle>;
};

export const EditTagIcon = ({tag, onUpdated, style}: EditTagIconProps) => {
  const edit = () => {
    getNavigation().navigate('TagManagementScreen', {
      initialTag: tag,
      onSubmit: onUpdated,
    });
  };

  return (
    <TouchableOpacity
      style={style}
      onPress={edit}
      accessibilityLabel="Edit Tag"
      accessibilityHint={`Edit Tag '${tag.name}'`}
    >
      <SimpleLineIcon
        name="pencil"
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: Colors.DARK,
        }}
      />
    </TouchableOpacity>
  );
};
