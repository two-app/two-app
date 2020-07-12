import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Modal, View} from 'react-native';
import Image from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
import {Content, ImageContent} from '../MemoryModels';
import {buildContentURI} from '../MemoryService';

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
  const [currentIndex, setCurrentIndex] = useState(index);
  useEffect(() => setCurrentIndex(index), [index]);

  const urls = content.map((c, index) => {
    const url = buildContentURI(c.fileKey, c.gallery);

    if (c.contentType === 'image') {
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
    <Modal
      visible={index != null}
      transparent={true}
      onDismiss={onClose}
      animated={true}
      animationType="fade"
      onRequestClose={onClose}>
      <ImageViewer
        enablePreload={true}
        menuContext={false}
        enableSwipeDown={true}
        saveToLocalByLongPress={false}
        onSwipeDown={onClose}
        onCancel={onClose}
        // @ts-ignore
        index={index}
        onChange={newIndex => {
          setCurrentIndex(newIndex || null);
        }}
        imageUrls={urls}
        renderImage={(a) => {
          const c = content[a.index];
          const uri = buildContentURI(c.fileKey, c.gallery);
          
          return c.contentType === 'video' ? (
            <View style={{flex: 1}}>
              <Video
                controls={false}
                paused={currentIndex !== a.index}
                muted={currentIndex !== a.index}
                repeat={true}
                source={{uri}}
                onError={console.log}
                style={{flex: 1}}
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

  const animatedOpacity = new Animated.Value(0);
  const AnimatedFastImage = Animated.createAnimatedComponent(Image);

  return (
    <View style={{flex: 1}}>
      <Image
        source={{uri: thumbnail, priority: 'high'}}
        style={{width: '100%', height: '100%'}}
      />
      <AnimatedFastImage
        source={{uri: gallery}}
        style={{
          opacity: animatedOpacity,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        onLoadEnd={() =>
          Animated.timing(animatedOpacity, {
            toValue: 1,
            useNativeDriver: false,
            duration: 0.2,
          }).start()
        }
      />
    </View>
  );
};
