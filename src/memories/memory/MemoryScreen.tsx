import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, Text, View, StyleSheet} from 'react-native';
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
import Colors from '../../Colors';
import MemoryInteractionModal from './MemoryInteractionModal';
import {TwoState} from '../../state/reducers';
import {selectMemory, updateMemory} from '../store';
import {connect, ConnectedProps} from 'react-redux';

type NavigationProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MemoryScreen'>;
  route: RouteProp<RootStackParamList, 'MemoryScreen'>;
};

const mapStateToProps = (state: TwoState, ownProps: NavigationProps) => ({
  memory: selectMemory(state.memories, ownProps.route.params.mid),
});

const connector = connect(mapStateToProps);
type ConnectorProps = ConnectedProps<typeof connector>;
type MemoryScreenProps = ConnectorProps & NavigationProps;

const MemoryScreen = ({memory, dispatch}: MemoryScreenProps) => {
  const [content, setContent] = useState<Content[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refreshMemory = () => {
    Promise.all([getMemory(memory.id), getMemoryContent(memory.id)])
      .then((result: [Memory, Content[]]) => {
        const [memory, content] = result;
        dispatch(updateMemory({mid: memory.id, memory}));
        setContent(content);
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

export default connector(MemoryScreen);

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
  const [modalIndex, setModalIndex] = useState<number | undefined>();
  const numberOfColumns = 4;
  const rows = chunkToRows(content, numberOfColumns);

  return (
    <>
      <MemoryInteractionModal
        memory={memory}
        content={content[modalIndex!]}
        onClose={() => setModalIndex(undefined)}
      />
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
