import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Image from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';

import {Content, ImageContent} from '../../content/ContentModels';
import {buildContentURI} from '../../content/ContentService';

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

  const closeGallery = () => {
    setCurrentIndex(null);
    onClose();
  };

  const urls = content.map((c, idx) => {
    const url = buildContentURI(c.fileKey, c.gallery);

    if (c.contentType === 'image') {
      const g = c.gallery as ImageContent;
      return {url, props: {index: idx}, width: g.width, height: g.height};
    } else {
      return {
        url,
        props: {index: idx},
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      };
    }
  });

  return (
    <Modal
      visible={index != null}
      transparent={true}
      onDismiss={closeGallery}
      animated={true}
      animationType="fade"
      onRequestClose={closeGallery}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'black'}
        animated={true}
      />
      <ImageViewer
        enablePreload={true}
        menuContext={false}
        enableSwipeDown={true}
        saveToLocalByLongPress={false}
        onSwipeDown={closeGallery}
        onCancel={closeGallery}
        // @ts-ignore
        index={index}
        onChange={(newIndex) => setCurrentIndex(newIndex || 0)}
        imageUrls={urls}
        renderImage={({index: idx}: {index: number}) => {
          const renderContent = content[idx];

          return renderContent.contentType === 'video' ? (
            <ProgressiveVideo
              content={renderContent}
              isActive={currentIndex === idx}
            />
          ) : (
            <ProgressiveImage content={renderContent} />
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
    <View style={{flex: 1}} key={gallery}>
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

type ProgressiveVideo = {
  content: Content;
  isActive: boolean;
};

const ProgressiveVideo = ({content, isActive}: ProgressiveVideo) => {
  const [isBuffering, setBuffering] = useState(true);
  const uri = buildContentURI(content.fileKey, content.gallery);
  const player = React.createRef<Video>();

  useEffect(() => {
    if (isActive) {
      player.current?.seek(0);
    }
  }, [isActive]);

  return (
    <View style={{flex: 1}} key={uri}>
      {isBuffering && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color="white" size="large" />
        </View>
      )}
      <Video
        ref={player}
        controls={false}
        paused={!isActive}
        muted={!isActive}
        repeat={true}
        source={{uri}}
        onError={console.log}
        resizeMode="contain"
        onLoad={() => setBuffering(false)}
        style={{flex: isBuffering ? 0 : 1}}
      />
    </View>
  );
};
