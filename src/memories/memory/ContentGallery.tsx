import {createRef, useEffect, useState} from 'react';
import {Animated, View, ActivityIndicator} from 'react-native';
import Image from 'react-native-fast-image';
import Video from 'react-native-video';

import {Content, contentUrl} from '../../content/ContentModels';

type ProgressiveImage = {
  content: Content;
};

const ProgressiveImage = ({content}: ProgressiveImage) => {
  const thumbnail = contentUrl(content, 'thumbnail');
  const gallery = contentUrl(content, 'gallery');

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
  const uri = contentUrl(content, 'gallery');
  const player = createRef<Video>();

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
