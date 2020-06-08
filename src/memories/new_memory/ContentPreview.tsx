import {Image as ImageType} from 'react-native-image-crop-picker';
import {Image, StyleSheet, Text, View} from 'react-native';
import Video from 'react-native-video';
import React from 'react';
import Colors from '../../Colors';

const ContentPreview = ({content}: {content: ImageType[]}) => {
  return (
    <>
      <Text style={s.previewTitle}>
        {content.length} images and videos chosen.
      </Text>

      <View style={s.previewContainer}>
        {content.map((image: ImageType) => {
          if (image.mime.startsWith('video')) {
            return (
              <View pointerEvents="none">
                <Video
                  repeat={true}
                  source={{uri: image.path}}
                  style={s.previewImage}
                  paused={false}
                  muted={true}
                  disableFocus={true}
                  resizeMode={'cover'}
                  playInBackground={true}
                  
                />
              </View>
            );
          } else {
            return (
              <Image
                source={{uri: 'file://' + image.path}}
                style={s.previewImage}
                key={image.path}
              />
            );
          }
        })}
      </View>
    </>
  );
};

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
  previewImage: {
    width: 70,
    height: 70,
    marginTop: 20,
    backgroundColor: Colors.LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {ContentPreview};
