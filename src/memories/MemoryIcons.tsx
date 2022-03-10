import {Text, View} from 'react-native';
import moment from 'moment';

import Colors from '../Colors';
import {DisplayTag} from '../tags/TagButton';
import {Tag} from '../tags/Tag';
import {
  DateIcon,
  ImageIcon,
  LocationIcon,
  TagsIcon,
  VideoIcon,
} from '../forms/Icons';

export const MemoryLocation = ({location}: {location: string}) => (
  <IconContainer>
    <LocationIcon color={Colors.REGULAR} size={20} />
    <TextContainer>{location}</TextContainer>
  </IconContainer>
);

export const MemoryDate = ({date}: {date: Date}) => (
  <IconContainer>
    <TextContainer padRight>{moment(date).fromNow()}</TextContainer>
    <DateIcon color={Colors.REGULAR} size={20} />
  </IconContainer>
);

export const MemoryImageCount = ({pictureCount}: {pictureCount: number}) => (
  <IconContainer>
    <ImageIcon color={Colors.REGULAR} size={20} />
    <TextContainer>{pictureCount}</TextContainer>
  </IconContainer>
);

export const MemoryVideoCount = ({
  videoCount,
  pad,
}: {
  videoCount: number;
  pad?: boolean;
}) => (
  <IconContainer>
    <VideoIcon
      color={Colors.REGULAR}
      size={20}
      style={[{marginLeft: pad ? 10 : 0}]}
    />
    <TextContainer>{videoCount}</TextContainer>
  </IconContainer>
);

export const MemoryTag = ({tag}: {tag: Tag}) => (
  <IconContainer>
    <DisplayTag tag={tag} />
    <TagsIcon size={17} color={Colors.REGULAR} style={{marginLeft: 5}} />
  </IconContainer>
);

const IconContainer = ({children}: {children: React.ReactNode}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>{children}</View>
);

const TextContainer = ({
  padRight,
  children,
}: {
  padRight?: boolean;
  children: string | number;
}) => (
  <Text
    style={{
      color: Colors.REGULAR,
      fontFamily: 'Montserrat-Medium',
      marginLeft: padRight ? 0 : 5,
      marginRight: padRight ? 5 : 0,
    }}>
    {children}
  </Text>
);
