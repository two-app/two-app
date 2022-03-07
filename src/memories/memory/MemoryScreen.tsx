import {useState, useEffect} from 'react';
import {FlatList, RefreshControl, Text, View, StyleSheet} from 'react-native';

import {Memory} from '../MemoryModels';
import {Container} from '../../views/View';
import {getMemory} from '../MemoryService';
import Colors from '../../Colors';
import {getContent} from '../../content/ContentService';
import {Content} from '../../content/ContentModels';

import {
  GridRow,
  TouchableImageCell,
  TouchableVideoCell,
  chunkToRows,
} from './Grid';
import {ContentGallery} from './ContentGallery';
import {MemoryToolbar} from './MemoryToolbar';
import {MemoryInteractionModal} from './MemoryInteractionModal';
import {Screen} from '../../navigation/NavigationUtilities';
import {useMemoryStore} from '../MemoryStore';
import {useContentStore} from '../../content/ContentStore';

export const MemoryScreen = ({route}: Screen<'MemoryScreen'>) => {
  const {mid} = route.params;
  const memoryStore = useMemoryStore();
  const contentStore = useContentStore();

  const memory = memoryStore.select(mid)!!;
  const content = contentStore.select(mid);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshMemory = () => {
    Promise.all([getMemory(mid), getContent(mid)])
      .then((result: [Memory, Content[]]) => {
        const [memory, content] = result;
        memoryStore.update(memory);
        contentStore.set(mid, content);
      })
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    refreshMemory();
  }, []);

  return (
    <Container>
      <ContentGrid
        memory={memory}
        data={content}
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
  data: Content[];
  refreshing: boolean;
  onRefresh: () => void;
};

const ContentGrid = ({
  memory,
  data,
  refreshing,
  onRefresh,
}: ContentGridProps) => {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | undefined>();
  const numberOfColumns = 4;
  const rows = chunkToRows(data, numberOfColumns);

  useEffect(() => {
    setGalleryIndex(null);
    setModalIndex(undefined);
  }, [JSON.stringify(data)]);

  return (
    <>
      <MemoryInteractionModal
        memory={memory}
        content={data[modalIndex!]}
        onClose={() => setModalIndex(undefined)}
      />
      <ContentGallery
        content={data}
        index={galleryIndex}
        onClose={() => setGalleryIndex(null)}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <MemoryToolbar memory={memory} />}
        contentContainerStyle={{paddingBottom: 100}}
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
                  onLongPress={() => setModalIndex(childIndex)}
                  key={content.contentId}
                />
              ) : (
                <TouchableVideoCell
                  item={content}
                  onClick={() => setGalleryIndex(childIndex)}
                  onLongPress={() => setModalIndex(childIndex)}
                  key={content.contentId}
                />
              );
            }}
            key={rowIndex}
          />
        )}
        keyExtractor={i =>
          i.map(c => (c == null ? 'empty' : c.contentId)).join('-')
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
    <Text style={styles.emptyText}>
      You haven't added any content to this memory yet! Upload some pictures 🖼️
      and videos 📹
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptyText: {
    color: Colors.REGULAR,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 30,
  },
});
