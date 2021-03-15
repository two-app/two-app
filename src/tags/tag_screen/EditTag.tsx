import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

import Colors from '../../Colors';
import {getNavigation} from '../../navigation/RootNavigation';
import {Tag} from '../Tag';

type EditTagIconProps = {
  tag: Tag;
  onUpdated: () => void;
};

export const EditTagIcon = ({tag, onUpdated}: EditTagIconProps) => {
  const edit = () => {
    getNavigation().navigate('TagManagementScreen', {
      initialTag: tag,
      onSubmit: onUpdated,
    });
  };

  return (
    <TouchableOpacity onPress={edit}>
      <SimpleLineIcon
        name="pencil"
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: Colors.DARK,
          marginRight: 20,
          marginLeft: 20,
        }}
      />
    </TouchableOpacity>
  );
};
