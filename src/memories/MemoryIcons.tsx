import FoundationIcon from 'react-native-vector-icons/Foundation';
import {StyleSheet, Text, View} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import Colors from '../Colors';
import {DisplayTag} from '../tags/TagButton';
import {Tag} from '../tags/Tag';

export const MemoryLocation = ({location}: {location: string}) => (
  <View style={c.icon}>
    <FoundationIcon name="marker" {...iconArguments} style={s.iconLeft} />
    <Text style={s.text}>{location}</Text>
  </View>
);

export const MemoryDate = ({date}: {date: number}) => (
  <View style={c.icon}>
    <Text style={s.text}>{moment(date).fromNow()}</Text>
    <AntIcon name="calendar" {...iconArguments} style={s.iconRight} />
  </View>
);

export const MemoryImageCount = ({pictureCount}: {pictureCount: number}) => (
  <View style={c.icon}>
    <IonIcon name="md-images" {...iconArguments} style={s.iconLeft} />
    <Text style={s.text}>{pictureCount}</Text>
  </View>
);

export const MemoryVideoCount = ({
  videoCount,
  pad,
}: {
  videoCount: number;
  pad?: boolean;
}) => (
  <View style={c.icon}>
    <MaterialIcon
      name="ondemand-video"
      {...iconArguments}
      style={{...s.iconLeft, marginLeft: pad === true ? 10 : 0}}
    />
    <Text style={s.text}>{videoCount}</Text>
  </View>
);

export const MemoryTag = ({tag}: {tag: Tag}) => (
  <View style={c.icon}>
    <DisplayTag tag={tag} />
    <AntIcon name="tagso" {...iconArguments} style={s.iconRight} />
  </View>
);

const iconArguments = {
  size: 18,
  color: Colors.REGULAR,
};

const c = StyleSheet.create({
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const s = StyleSheet.create({
  text: {
    color: Colors.REGULAR,
    fontFamily: 'Montserrat-SemiBold',
  },
  iconRight: {
    marginLeft: 5,
  },
  iconLeft: {
    marginRight: 5,
  },
});
