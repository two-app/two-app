import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Image from 'react-native-fast-image';
import Video from 'react-native-video';
import {connect, ConnectedProps} from 'react-redux';

import {Container} from '../views/View';
import {RootStackParamList} from '../../Router';
import Colors from '../Colors';
import {Heading} from '../home/Heading';
import {chunkToRows, GridRow, Cell} from '../memories/memory/Grid';
import SubmitButton from '../forms/SubmitButton';
import {MemoryImageCount, MemoryVideoCount} from '../memories/MemoryIcons';
import {uploadToMemory} from '../memories/MemoryService';
import {ErrorResponse} from '../http/Response';
import {updateMemory, selectMemory, storeContent} from '../memories/store';
import {TwoState} from '../state/reducers';
import {Memory} from '../memories/MemoryModels';

import {PickedContent} from './ContentPicker';
import {Content} from './ContentModels';

type NavigationProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ContentUploadScreen'>;
  route: RouteProp<RootStackParamList, 'ContentUploadScreen'>;
};

const mapStateToProps = (state: TwoState, ownProps: NavigationProps) => ({
  memory: selectMemory(state.memories, ownProps.route.params.mid),
});

const connector = connect(mapStateToProps);
type ContentUploadScreenProps = ConnectedProps<typeof connector> &
  NavigationProps;

type Loading = {
  isLoading: boolean;
  percentage: number | undefined;
};

export const ContentUploadScreen = ({
  navigation,
  route,
  dispatch,
  memory,
}: ContentUploadScreenProps) => {
  const [loading, setLoading] = useState<Loading>({
    isLoading: false,
    percentage: 0,
  });
  const [uploadError, setUploadError] = useState<string>('');

  const content: PickedContent[] = route.params.content.map((c) => {
    if (c.filename == null) {
      const ext = c.path.split('.').pop();
      return {...c, filename: `${uuidv4()}.${ext}`};
    } else {
      return c;
    }
  });

  const images = content.filter((c) => c.mime.startsWith('image'));
  const videos = content.filter((c) => c.mime.startsWith('video'));

  const setLoadingPercentage = (percentage: number) => {
    setLoading({isLoading: true, percentage});
  };

  const upload = () => {
    setLoading({isLoading: true, percentage: 0});
    uploadToMemory(memory.id, content, setLoadingPercentage)
      .then(([updatedMemory, updatedContent]: [Memory, Content[]]) => {
        dispatch(updateMemory({mid: memory.id, memory: updatedMemory}));
        dispatch(storeContent({mid: memory.id, content: updatedContent}));
        navigation.goBack();
      })
      .catch((e: ErrorResponse) => setUploadError(e.reason))
      .finally(() => setLoading({isLoading: false, percentage: undefined}));
  };

  const footer = (
    <>
      <SubmitButton
        onSubmit={upload}
        text="Upload"
        accessibilityLabel="Upload Content"
      />
      <Text
        accessibilityHint="The error encountered with the upload."
        style={{color: Colors.DARK_SALMON}}>
        {uploadError}
      </Text>
    </>
  );

  return (
    <Container
      isLoading={loading.isLoading}
      loadingPercentage={loading.percentage}>
      <View>
        <FlatList
          data={chunkToRows(content, 3)}
          ListHeaderComponent={
            <Header
              numberOfImages={images.length}
              numberOfVideos={videos.length}
            />
          }
          ListFooterComponent={footer}
          renderItem={({item}) => (
            <GridRow content={item} renderCell={renderCell} />
          )}
          keyExtractor={(i) => i.map((x) => x?.filename).join()}
        />
      </View>
    </Container>
  );
};

export default connector(ContentUploadScreen);

type HeaderProps = {
  numberOfImages: number;
  numberOfVideos: number;
};

const Header = ({numberOfImages, numberOfVideos}: HeaderProps) => (
  <>
    <Heading style={{marginTop: 10}}>Upload Content</Heading>
    <View style={{flexDirection: 'row', marginVertical: 10}}>
      <MemoryImageCount pictureCount={numberOfImages} />
      <MemoryVideoCount videoCount={numberOfVideos} pad={true} />
    </View>
  </>
);

const renderCell = (content: PickedContent) => {
  const Preview = content.mime.startsWith('video') ? VideoCell : ImageCell;
  return <Preview content={content} key={content.filename} />;
};

type PreviewProps = {
  content: PickedContent;
};

const ImageCell = ({content}: PreviewProps) => (
  <Cell a11={{accessibilityLabel: 'A preview of selected content.'}}>
    <Image
      source={{uri: content.path}}
      style={s.previewContent}
      key={content.path}
    />
  </Cell>
);

const VideoCell = ({content}: PreviewProps) => (
  <Cell a11={{accessibilityLabel: 'A preview of selected content.'}}>
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
  </Cell>
);

const s = StyleSheet.create({
  previewContent: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.LIGHT,
  },
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
