import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View, Text, StyleSheet} from 'react-native';
import {Memory, Content} from '../MemoryModels';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../Router';
import {RouteProp} from '@react-navigation/native';
import {Container} from '../../views/View';
import {getMemory, getMemoryContent} from '../MemoryService';

import _ from 'lodash';
import {chunkContentToRows, GridRow, ImageCell, VideoCell} from './Grid';
import {ContentGallery} from './ContentGallery';
import { MemoryToolbar } from './MemoryToolbar';

type MemoryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MemoryScreen'>;
  route: RouteProp<RootStackParamList, 'MemoryScreen'>;
};

export const MemoryScreen = ({route}: MemoryScreenProps) => {
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
  const rows = chunkContentToRows(content, numberOfColumns);

  return (
    <>
      <ContentGallery
        content={content}
        index={galleryIndex}
        onClose={() => setGalleryIndex(null)}
      />
      <FlatList
        ListHeaderComponent={() => <MemoryToolbar memory={memory} />}
        data={rows}
        renderItem={({item, index: rowIndex}) => (
          <GridRow
            content={item}
            renderCell={(content, colIndex) => {
              const childIndex = rowIndex * numberOfColumns + colIndex;
              return content.contentType === 'image' ? (
                <ImageCell
                  item={content}
                  onClick={() => setGalleryIndex(childIndex)}
                />
              ) : (
                <VideoCell
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
