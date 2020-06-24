import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import Image from 'react-native-image-progress';
// @ts-ignore
import Progress from 'react-native-progress/Circle';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {
  MemoryDate,
  MemoryImageCount,
  MemoryLocation,
  MemoryTag,
  MemoryVideoCount
} from './MemoryIcons';
import { Content, Memory } from './MemoryModels';

export const MemoryDisplayView = ({memory}: {memory: Memory}) => (
  <View>
    <Text style={s.heading}>{memory.title}</Text>
    <View style={s.spacedRow}>
      <MemoryLocation location={memory.location} />
      <MemoryDate date={memory.date} />
    </View>
    <View style={s.spacedRow}>
      <View style={{flexDirection: 'row'}}>
        {memory.imageCount > 0 && (
          <MemoryImageCount pictureCount={memory.imageCount} />
        )}
        {memory.videoCount > 0 && (
          <MemoryVideoCount
            videoCount={memory.videoCount}
            pad={memory.imageCount > 0}
          />
        )}
      </View>
      {memory.tag != null && <MemoryTag tag={memory.tag} />}
    </View>
    {memory.displayContent != null && (
      <MemoryDisplayPicture content={memory.displayContent} />
    )}
  </View>
);

const MemoryDisplayPicture = ({content}: {content: Content}) => {
  const uri: string = `${content.fileKey}-${content.display.suffix}.${content.display.extension}`;
  return (
    <View style={s.image}>
      <Image
        style={{width: '100%', height: '100%'}}
        source={{uri}}
        indicator={Progress}
        indicatorProps={{
          borderWidth: 1,
          borderColor: Colors.REGULAR,
          color: Colors.REGULAR,
        }}
      />
    </View>
  );
};

const s = StyleSheet.create({
  heading: {
    color: Colors.DARK,
    fontSize: 25,
    fontFamily: 'Montserrat-Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
    marginTop: 10,
  },
});
