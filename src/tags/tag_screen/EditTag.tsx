import {useNavigation} from '@react-navigation/native';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Colors from '../../Colors';
import {Routes} from '../../navigation/NavigationUtilities';
import {Tag} from '../Tag';

type EditTagIconProps = {
  tag: Tag;
  onUpdated: () => void;
  style?: StyleProp<ViewStyle>;
};

export const EditTagIcon = ({tag, onUpdated, style}: EditTagIconProps) => {
  const {navigate} = useNavigation<Routes>();
  const edit = () =>
    navigate('TagManagementScreen', {
      initialTag: tag,
      onSubmit: onUpdated,
    });

  return (
    <TouchableOpacity
      style={style}
      onPress={edit}
      accessibilityLabel="Edit Tag"
      accessibilityHint={`Edit Tag '${tag.name}'`}>
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
