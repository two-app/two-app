import React, {useState, useEffect, useRef} from 'react';
import {FlatList, RefreshControl, Text, View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';

import {Memory} from '../MemoryModels';
import {RootStackParamList} from '../../../Router';
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
import MemoryInteractionModal from './MemoryInteractionModal';

type NavigationProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MemoryScreen'>;
  route: RouteProp<RootStackParamList, 'MemoryScreen'>;
};

const mapStateToProps = (state: TwoState, ownProps: NavigationProps) => {
  const {mid} = ownProps.route.params;
  return {
    memory: selectMemory(state.memories, mid),
    content: selectMemoryContent(state.memories, mid),
  };
};

const connector = connect(mapStateToProps);
type ConnectorProps = ConnectedProps<typeof connector>;
type MemoryScreenProps = ConnectorProps & NavigationProps;

const MemoryScreen = ({memory, dispatch, content}: MemoryScreenProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasMounted = useRef<boolean>(false);
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const refreshMemory = () => {
    Promise.all([getMemory(memory.id), getContent(memory.id)])
      .then((result: [Memory, Content[]]) => {
        const [updatedMemory, updatedContent] = result;
        dispatch(updateMemory({mid: updatedMemory.id, memory: updatedMemory}));
        dispatch(
          storeContent({mid: updatedMemory.id, content: updatedContent}),
        );
      })
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    getContent(memory.id).then((newContent) => {
      dispatch(storeContent({mid: memory.id, content: newContent}));
    });
  }, []);

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

export default connector(MemoryScreen);

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
                  key={content.fileKey}
                />
              ) : (
                <TouchableVideoCell
                  item={content}
                  onClick={() => setGalleryIndex(childIndex)}
                  onLongPress={() => setModalIndex(childIndex)}
                  key={content.fileKey}
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
