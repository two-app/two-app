import React from 'react';
import {Image as ImageType} from 'react-native-image-crop-picker';
import {Image, StyleSheet, Text, View} from 'react-native';
import Video from 'react-native-video';
import Colors from '../../Colors';

const isVideo = (file: ImageType) => file.mime.startsWith('video');

const ContentPreview = ({content}: {content: ImageType[]}) => {
  const videoCount = content.filter((file) => isVideo(file)).length;
  const imageCount = content.length - videoCount;

  const previews = content.map((file) =>
    isVideo(file) ? (
      <VideoPreview content={file} />
    ) : (
      <ImagePreview content={file} />
    ),
  );

  return (
    <>
      <Text style={s.previewTitle}>
        {imageCount} images and {videoCount} videos chosen.
      </Text>

      <View style={s.previewContainer}>{previews}</View>
    </>
  );
};

type PreviewProps = {
  content: ImageType;
};

const ImagePreview = ({content}: PreviewProps) => (
  <Image
    source={{uri: content.path}}
    style={s.previewContent}
    key={content.path}
  />
);

const VideoPreview = ({content}: PreviewProps) => (
  <View pointerEvents="none">
    <Video
      repeat={true}
      source={{uri: content.path}}
      style={s.previewContent}
      paused={false}
      muted={true}
      disableFocus={true}
      resizeMode={'cover'}
      playInBackground={true}
    />
  </View>
);

const s = StyleSheet.create({
  previewTitle: {
    marginTop: 20,
    color: Colors.REGULAR,
    textAlign: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  previewContent: {
    width: 70,
    height: 70,
    marginTop: 20,
    backgroundColor: Colors.LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {ContentPreview};
