import {StyleSheet, View} from 'react-native';
import {Screen} from '../navigation/NavigationUtilities';
import Gallery, {RenderItemInfo} from 'react-native-awesome-gallery';
import {useContentStore} from './ContentStore';
import {contentUrl} from './ContentModels';
import {useCallback} from 'react';
import {SharedElement} from 'react-navigation-shared-element';
import FastImage from 'react-native-fast-image';

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

  goBack();

  return (
    <View style={{flex: 1}}>
      <Gallery
        data={content.map(c => ({uri: contentUrl(c, 'gallery')}))}
        keyExtractor={item => item.uri}
        renderItem={renderItem}
        onIndexChange={onIndexChange}
        initialIndex={index}
        onSwipeToClose={() => {
          console.log('ONSwipeToClose');
          goBack();
        }}
      />
    </View>
  );
};

const renderItem = ({
  index,
  item,
  setImageDimensions,
}: RenderItemInfo<{uri: string}>) => {
  console.log('rendering inf ast image');
  return (
    <SharedElement id={`${index}`} style={StyleSheet.absoluteFillObject}>
      <FastImage
        source={{uri: item.uri}}
        style={StyleSheet.absoluteFillObject}
        resizeMode={FastImage.resizeMode.contain}
        onLoad={e => {
          const {width, height} = e.nativeEvent;
          setImageDimensions({width, height});
        }}
      />
    </SharedElement>
  );
};
