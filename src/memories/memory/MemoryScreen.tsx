import {useState, useEffect, useRef} from 'react';
import {FlatList, RefreshControl, Text, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Memory} from '../MemoryModels';
import {Container} from '../../views/View';
import {getMemory} from '../MemoryService';
import Colors from '../../Colors';
import {TwoState} from '../../state/reducers';
import {
  selectMemory,
  updateMemory,
  selectMemoryContent,
  storeContent,
} from '../store';
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

export const MemoryScreen = ({route}: Screen<'MemoryScreen'>) => {
  const dispatch = useDispatch();
  const mid = route.params.mid;
  const memory = useSelector((s: TwoState) => selectMemory(s.memories, mid));
  const content = useSelector((s: TwoState) =>
    selectMemoryContent(s.memories, mid),
  );

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasMounted = useRef<boolean>(false);
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const refreshMemory = () => {
    Promise.all([getMemory(memory.mid), getContent(memory.mid)])
      .then((result: [Memory, Content[]]) => {
        const [updatedMemory, updatedContent] = result;
        dispatch(updateMemory({mid: updatedMemory.mid, memory: updatedMemory}));
        dispatch(
          storeContent({mid: updatedMemory.mid, content: updatedContent}),
        );
      })
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    getContent(memory.mid).then(newContent => {
      dispatch(storeContent({mid: memory.mid, content: newContent}));
    });
  }, []);

  // TODO fix this piece of shit
  // refresh entire memory on content change (update, delete)
  useEffect(() => {
    if (hasMounted) {
      refreshMemory();
    }
  }, [JSON.stringify(content)]);

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
