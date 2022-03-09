import {StyleSheet, Text, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import Colors from '../Colors';
import {DisplayTag} from '../tags/TagButton';
import {Tag} from '../tags/Tag';

export const MemoryLocation = ({location}: {location: string}) => (
  <View style={c.icon}>
    <IonIcon name="navigate-circle-outline" color={Colors.REGULAR} size={20} />

    <Text
      style={{
        color: Colors.REGULAR,
        fontFamily: 'Montserrat-Medium',
        marginLeft: 5,
      }}>
      {location}
    </Text>
  </View>
);

export const MemoryDate = ({date}: {date: Date}) => (
  <View style={c.icon}>
    <Text
      style={{
        marginRight: 5,
        color: Colors.REGULAR,
        fontFamily: 'Montserrat-Medium',
      }}>
      {moment(date).fromNow()}
    </Text>
    <IonIcon name="calendar-outline" color={Colors.REGULAR} size={20} />
  </View>
);

export const MemoryImageCount = ({pictureCount}: {pictureCount: number}) => (
  <View style={c.icon}>
    <IonIcon name="image-outline" color={Colors.REGULAR} size={20} />
    <Text
      style={{
        marginLeft: 5,
        color: Colors.REGULAR,
        fontFamily: 'Montserrat-Medium',
      }}>
      {pictureCount}
    </Text>
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
    <IonIcon
      name="aperture-outline"
      {...iconArguments}
      style={[{marginLeft: pad ? 10 : 0}]}
    />
    <Text
      style={{
        marginLeft: 5,
        color: Colors.REGULAR,
        fontFamily: 'Montserrat-Medium',
      }}>
      {videoCount}
    </Text>
  </View>
);

export const MemoryTag = ({tag}: {tag: Tag}) => (
  <View style={c.icon}>
    <DisplayTag tag={tag} />
    <IonIcon
      name="pricetags-outline"
      size={17}
      color={Colors.REGULAR}
      style={[s.iconRight, {transform: [{rotateY: '180deg'}]}]}
    />
  </View>
);

const iconArguments = {
  size: 20,
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
