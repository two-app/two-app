import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getMemories} from './MemoryService';
import {Memory} from './MemoryModels';
import Colors from '../Colors';
import {GridIcon, GroupedIcon, TimelineIcon} from './MemoryHeaderIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {Heading} from '../home/Heading';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Router';
import {useNavigation} from '@react-navigation/native';
import {MemoryDisplayView} from './MemoryDisplayView';
import {TouchableCard} from '../forms/Card';
import {TwoState, persistor} from '../state/reducers';
import {connect, ConnectedProps} from 'react-redux';
import {selectMemories} from './store/selectors';
import {storeMemories, emptyMemories} from './store/actions';
import { getNavigation } from '../navigation/RootNavigation';

const mapStateToProps = (state: TwoState) => ({
  memories: selectMemories(state.memories),
});

const connector = connect(mapStateToProps);
type ConnectorProps = ConnectedProps<typeof connector>;
type MemoriesProps = ConnectorProps;

type LoadingStatus = {
  loading: boolean;
  refreshing: boolean;
  loadingError: boolean;
};

const Memories = ({memories, dispatch}: MemoriesProps) => {
  let memoryFlatListRef: FlatList<Memory> | null;
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({
    loading: true,
    refreshing: false,
    loadingError: false,
  });

  const refreshMemories = () => {
    setLoadingStatus({...loadingStatus, loading: true});
    getMemories()
      .then((memories: Memory[]) => {
        dispatch(storeMemories(memories));
        setLoadingStatus({...loadingStatus, loadingError: false});
        persistor.persist();
      })
      .catch(() => setLoadingStatus({...loadingStatus, loadingError: true}))
      .finally(() =>
        setLoadingStatus({...loadingStatus, loading: false, refreshing: false}),
      );
  };

  const scrollToTop = (): void => {
    if (memoryFlatListRef != null) {
      memoryFlatListRef.scrollToOffset({
        offset: 75,
        animated: true,
      });
    }
  }

  useEffect(() => {
    refreshMemories();
  }, []);

  return (
    <FlatList
      data={memories}
      ref={(ref) => (memoryFlatListRef = ref)}
      onContentSizeChange={scrollToTop}
      renderItem={(item) => (
        <MemoryItemNavigation item={item.item} />
      )}
      keyExtractor={(i) => i.id.toString()}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={MemoryHeader}
      ListEmptyComponent={() => (
        <EmptyMemoriesComponent loadingStatus={loadingStatus} />
      )}
      refreshControl={
        <RefreshControl
          colors={['#9Bd35A', '#689F38']}
          refreshing={loadingStatus.refreshing}
          onRefresh={() => {
            setLoadingStatus({...loadingStatus, refreshing: true});
            refreshMemories();
          }}
        />
      }
    />
  );
};

const MemoryHeader = () => {
  const {navigate} = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <>
      <TouchableCard
        style={{marginTop: 20}}
        onPress={() => navigate('SearchScreen')}>
        <EvilIcon
          name="search"
          style={{fontSize: 20, paddingRight: 10, color: Colors.REGULAR}}
        />
        <Text style={{color: Colors.REGULAR}}>Find memories...</Text>
      </TouchableCard>

      <Heading>Memories</Heading>

      <TouchableCard
        style={{marginTop: 10}}
        onPress={() => navigate('NewMemoryScreen')}>
        <SimpleLineIcon
          name="pencil"
          style={{fontSize: 13, paddingRight: 10, color: Colors.REGULAR}}
        />
        <Text style={{color: Colors.REGULAR}}>Title of your new memory...</Text>
      </TouchableCard>

      <View style={{marginTop: 20, flexDirection: 'row'}}>
        <TimelineIcon focused />
        <GroupedIcon />
        <GridIcon />
      </View>
    </>
  );
};

type MemoryItemNavigationProps = {
  item: Memory;
};

const MemoryItemNavigation = ({
  item
}: MemoryItemNavigationProps) => (
  <TouchableOpacity
    style={containers.item}
    onPress={() => getNavigation().navigate('MemoryScreen', {mid: item.id})}>
    <MemoryDisplayView memory={item} />
  </TouchableOpacity>
);

const EmptyMemoriesComponent = ({
  loadingStatus,
}: {
  loadingStatus: LoadingStatus;
}) => (
  <>
    <Text style={{textAlign: 'center', color: Colors.REGULAR, marginTop: 40}}>
      {loadingStatus.loadingError
        ? `Sorry, we were unable to load your memories.\nTry again soon.`
        : loadingStatus.loading
        ? 'Loading your memories...'
        : `You don't have any memories. Create some!`}
    </Text>
  </>
);

const containers = StyleSheet.create({
  item: {
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    flexDirection: 'row',
    flex: 1,
    height: 200,
    marginTop: 10,
  },
});

export default connector(Memories);
