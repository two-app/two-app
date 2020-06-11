import React from 'react';
import GallerySwiper from 'react-native-gallery-swiper';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
// @ts-ignore
import {createImageProgress} from 'react-native-image-progress';
const Image = createImageProgress(FastImage);
import {Modal} from 'react-native';
import {Content} from '../MemoryModels';

type ContentGalleryProps = {
  content: Content[];
  index: number | null;
  onClose: () => void;
};

export const ContentGallery = ({
  content,
  index,
  onClose,
}: ContentGalleryProps) => {
  return (
    <Modal
      animationType={'fade'}
      visible={index != null}
      onRequestClose={onClose}>
      <GallerySwiper
        images={content.map((c) => ({
          uri: c.fileKey,
          dimensions: {width: 1080, height: 1920},
        }))}
        style={{backgroundColor: 'white'}}
        initialNumToRender={content.length}
        initialPage={index || 0}
        onSwipeDownReleased={onClose}
        onSwipeUpReleased={onClose}
        imageComponent={(imageProps, dim, index) =>
          content[index].contentType === 'video' ? (
            <Video
              repeat={true}
              // @ts-ignore
              source={imageProps.source}
              style={{width: '100%', height: '100%'}}
              onError={console.log}
            />
          ) : (
            <Image {...imageProps} />
          )
        }
      />
    </Modal>
  );
};
