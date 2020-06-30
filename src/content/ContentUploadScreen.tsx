import React, {useState} from 'react';
import {Container} from '../views/View';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Router';
import {RouteProp} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../Colors';
import {Heading} from '../home/Heading';
import {chunkToRows, GridRow, Cell} from '../memories/memory/Grid';
import {FlatList} from 'react-native-gesture-handler';
import {PickedContent} from '../memories/new_memory/ContentInput';
import Image from 'react-native-fast-image';
import Video from 'react-native-video';
import SubmitButton from '../forms/SubmitButton';
import {MemoryImageCount, MemoryVideoCount} from '../memories/MemoryIcons';
import {uploadToMemory} from '../memories/MemoryService';
import {ErrorResponse} from '../http/Response';

type ContentUploadScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ContentUploadScreen'>;
  route: RouteProp<RootStackParamList, 'ContentUploadScreen'>;
};

type Loading = {
  isLoading: boolean;
  percentage: number | undefined;
};

export const ContentUploadScreen = ({
  navigation,
  route,
}: ContentUploadScreenProps) => {
  const [loading, setLoading] = useState<Loading>({
    isLoading: false,
    percentage: 0,
  });
  const [uploadError, setUploadError] = useState<string>('');
  const {memory, content} = route.params;
  const images = content.filter((c) => c.mime.startsWith('image'));
  const videos = content.filter((c) => c.mime.startsWith('video'));

  const upload = () => {
    uploadToMemory(memory.id, content, (percentage: number) =>
      setLoading({isLoading: true, percentage}),
    )
      .then(() => navigation.goBack())
      .catch((e: ErrorResponse) => setUploadError(e.reason))
      .finally(() => setLoading({isLoading: false, percentage: undefined}));
  };

  const footer = (
    <>
      <SubmitButton onSubmit={upload} text="Upload" />
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
          renderItem={({item, index: rowIndex}) => (
            <GridRow content={item} renderCell={renderCell} />
          )}
          keyExtractor={(i) => i.map((x) => x?.filename).join()}
        />
        <Text style={{color: Colors.DARK_SALMON}}>{uploadError}</Text>
      </View>
    </Container>
  );
};

type HeaderProps = {
  numberOfImages: number;
  numberOfVideos: number;
};

const Header = ({numberOfImages, numberOfVideos}: HeaderProps) => {
  return (
    <>
      <Heading style={{marginTop: 10}}>Upload Content</Heading>
      <View style={{flexDirection: 'row', marginVertical: 10}}>
        <MemoryImageCount pictureCount={numberOfImages} />
        <MemoryVideoCount videoCount={numberOfVideos} pad={true} />
      </View>
    </>
  );
};

type PreviewProps = {
  content: PickedContent;
};

const renderCell = (content: PickedContent) => {
  const Preview = content.mime.startsWith('video') ? VideoCell : ImageCell;
  return <Preview content={content} />;
};

const ImageCell = ({content}: PreviewProps) => (
  <Cell>
    <Image
      source={{uri: content.path}}
      style={s.previewContent}
      key={content.path}
    />
  </Cell>
);

const VideoCell = ({content}: PreviewProps) => (
  <Cell>
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
  previewTitle: {
    color: Colors.VERY_DARK,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  previewContent: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.LIGHT,
  },
});
