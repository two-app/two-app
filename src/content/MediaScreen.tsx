import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Screen} from '../navigation/NavigationUtilities';
import Gallery, {RenderItemInfo} from 'react-native-awesome-gallery';
import {useContentStore} from './ContentStore';
import {Content, contentUrl} from './ContentModels';
import {createRef, useCallback, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

export const MediaScreen = ({navigation, route}: Screen<'MediaScreen'>) => {
  const {setParams, goBack, isFocused} = navigation;
  const {index, mid} = route.params;

  const onIndexChange = useCallback(
    (index: number) => {
      isFocused() && setParams({index});
    },
    [setParams],
  );

  const contentStore = useContentStore();
  const content = contentStore.select(mid);

  return (
    <View style={{flex: 1}}>
      <Gallery
        data={content}
        keyExtractor={item => item.contentId}
        renderItem={info =>
          info.item.contentType === 'image'
            ? renderImage(info)
            : renderVideo(info, info.index === index)
        }
        onIndexChange={onIndexChange}
        initialIndex={index}
        onSwipeToClose={() => goBack()}
      />
    </View>
  );
};

const renderImage = ({item, setImageDimensions}: RenderItemInfo<Content>) => {
  const uri = contentUrl(item, 'gallery');
  setImageDimensions({width: item.gallery.width, height: item.gallery.height});

  return (
    <FastImage
      source={{uri}}
      style={StyleSheet.absoluteFillObject}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

const renderVideo = (info: RenderItemInfo<Content>, active: boolean) => {
  const {item, setImageDimensions} = info;
  const uri = contentUrl(item, 'gallery');
  setImageDimensions({width: item.gallery.width, height: item.gallery.height});

  const [isBuffering, setBuffering] = useState(true);
  const player = createRef<Video>();

  useEffect(() => {
    if (active) {
      player.current?.seek(0);
    }
  }, [active]);

  return (
    <View style={{flex: 1}}>
      {isBuffering && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color="white" size="large" />
        </View>
      )}
      <Video
        ref={player}
        controls={true}
        paused={!active}
        muted={!active}
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
