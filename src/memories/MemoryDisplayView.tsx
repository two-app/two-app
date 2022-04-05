import {StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {Content, contentUrl} from '../content/ContentModels';

import {
  MemoryDate,
  MemoryImageCount,
  MemoryLocation,
  MemoryTag,
  MemoryVideoCount,
} from './MemoryIcons';
import {Memory} from './MemoryModels';

export const MemoryDisplayView = ({memory}: {memory: Memory}) => {
  const {title, location, occurredAt, imageCount, videoCount, tag} = memory;
  return (
    <View>
      <Text style={s.heading}>{title}</Text>
      <View style={s.spacedRow}>
        <MemoryLocation location={location} />
        <MemoryDate date={occurredAt} />
      </View>
      <View style={s.spacedRow}>
        <View style={{flexDirection: 'row'}}>
          {imageCount > 0 && <MemoryImageCount pictureCount={imageCount} />}
          {videoCount > 0 && (
            <MemoryVideoCount videoCount={videoCount} pad={imageCount > 0} />
          )}
        </View>
        {tag != null && <MemoryTag tag={tag} />}
      </View>
      {memory.displayContent != null && (
        <MemoryDisplayPicture content={memory.displayContent} />
      )}
    </View>
  );
};

const MemoryDisplayPicture = ({content}: {content: Content}) => (
  <View style={s.image}>
    <Image
      style={{width: '100%', height: '100%'}}
      source={{uri: contentUrl(content, 'thumbnail')}}
    />
  </View>
);

const s = StyleSheet.create({
  heading: {
    color: Colors.DARK,
    fontSize: 25,
    fontFamily: 'Montserrat-Bold',
  },
  spacedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  image: {
    flexDirection: 'row',
    height: 200,
    marginTop: 15,
  },
});
