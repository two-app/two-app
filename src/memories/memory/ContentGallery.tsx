import React from 'react';
import { Animated, Dimensions, Image, Modal, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
import { Content, ImageContent } from '../MemoryModels';
import { buildContentURI } from '../MemoryService';

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
  const urls = content.map((c, index) => {
    const url = buildContentURI(c.fileKey, c.gallery);
    if (c.contentType === 'image') {
      Image.prefetch(url);
      const g = c.gallery as ImageContent;
      return {url, props: {index}, width: g.width, height: g.height};
    } else {
      return {
        url,
        props: {index},
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      };
    }
  });

  return (
    <Modal visible={index != null} transparent={true} onDismiss={onClose}>
      <ImageViewer
        enablePreload={false}
        menuContext={false}
        enableSwipeDown={true}
        saveToLocalByLongPress={false}
        onSwipeDown={onClose}
        onCancel={onClose}
        // @ts-ignore
        index={index}
        imageUrls={urls}
        renderImage={(a) => {
          const c = content[a.index];
          const uri = buildContentURI(c.fileKey, c.gallery);
          return c.contentType === 'video' ? (
            <View
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Video
                controls={false}
                repeat={true}
                source={{uri}}
                onError={console.log}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
                key={uri}
              />
            </View>
          ) : (
            <ProgressiveImage content={c} key={uri} />
          );
        }}
      />
    </Modal>
  );
};

type ProgressiveImage = {
  content: Content;
};

const ProgressiveImage = ({content}: ProgressiveImage) => {
  const thumbnail = buildContentURI(content.fileKey, content.thumbnail);
  const gallery = buildContentURI(content.fileKey, content.gallery);
  const {width, height} = content.gallery as ImageContent;

  const animatedOpacity = new Animated.Value(0);

  return (
    <View style={{flex: 1}}>
      <Image
        source={{uri: thumbnail}}
        blurRadius={5}
        width={width}
        height={height}
        resizeMethod="resize"
        resizeMode="cover"
        style={{width: '100%', height: '100%'}}
      />
      <Animated.Image
        source={{uri: gallery}}
        width={width}
        height={height}
        style={{
          opacity: animatedOpacity,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        onLoad={() =>
          Animated.timing(animatedOpacity, {
            toValue: 1,
            useNativeDriver: false,
          }).start()
        }
      />
    </View>
  );
};
