import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Memory, Content} from '../MemoryModels';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../Router';
import {RouteProp} from '@react-navigation/native';
import {Container} from '../../views/View';
import {getMemory, getMemoryContent} from '../MemoryService';
import _ from 'lodash';
import {
  GridRow,
  TouchableImageCell,
  TouchableVideoCell,
  chunkToRows,
} from './Grid';
import {ContentGallery} from './ContentGallery';
import {MemoryToolbar} from './MemoryToolbar';

type MemoryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MemoryScreen'>;
  route: RouteProp<RootStackParamList, 'MemoryScreen'>;
};

export const MemoryScreen = ({navigation, route}: MemoryScreenProps) => {
  const [memory, setMemory] = useState<Memory>(route.params.memory);
  const [content, setContent] = useState<Content[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshMemory = () => {
    Promise.all([getMemory(memory.id), getMemoryContent(memory.id)])
      .then((result: any[]) => {
        setMemory(result[0]);
        setContent(result[1]);
      })
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    getMemoryContent(memory.id).then(setContent);
  }, []);

  return (
    <Container>
      <ContentGrid
        memory={memory}
        content={content}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          refreshMemory();
        }}
      />
    </Container>
  );
};

type ContentGridProps = {
  memory: Memory;
  content: Content[];
  refreshing: boolean;
  onRefresh: () => void;
};

const ContentGrid = ({
  memory,
  content,
  refreshing,
  onRefresh,
}: ContentGridProps) => {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const numberOfColumns = 4;
  const rows = chunkToRows(content, numberOfColumns);

  return (
    <>
      <ContentGallery
        content={content}
        index={galleryIndex}
        onClose={() => setGalleryIndex(null)}
      />
      <FlatList
        ListHeaderComponent={() => <MemoryToolbar memory={memory} />}
        ListEmptyComponent={EmptyMemory}
        data={rows}
        renderItem={({item, index: rowIndex}) => (
          <GridRow
            content={item}
            renderCell={(content, colIndex) => {
              const childIndex = rowIndex * numberOfColumns + colIndex;
              return content.contentType === 'image' ? (
                <TouchableImageCell
                  item={content}
                  onClick={() => setGalleryIndex(childIndex)}
                />
              ) : (
                <TouchableVideoCell
                  item={content}
                  onClick={() => setGalleryIndex(childIndex)}
                />
              );
            }}
            key={rowIndex}
          />
        )}
        keyExtractor={(i) =>
          i.map((c) => (c == null ? 'empty' : c.fileKey)).join('-')
        }
        refreshControl={
          <RefreshControl
            colors={['#9Bd35A', '#689F38']}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </>
  );
};

const EmptyMemory = () => (
  <View style={{padding: 20, marginTop: 5, alignItems: 'center'}}>
    <Text style={{textAlign: 'center', lineHeight: 25, marginBottom: 30}}>
      You haven't added any content to this memory yet! Upload some pictures 🖼️
      and videos 📹
    </Text>
  </View>
);
