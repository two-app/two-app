import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, RefreshControl} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import type {ConnectedProps} from 'react-redux';
import {connect} from 'react-redux';

import Colors from '../../Colors';
import type {RootStackParamList} from '../../../Router';
import {Footer} from '../../home/Footer';
import {Wrapper, NoWrapContainer} from '../../views/View';
import {Heading} from '../../home/Heading';
import * as TagService from '../TagService';
import type {Tag} from '../Tag';
import {NewTagButton} from '../NewTagButton';
import {LoadingStatus} from '../../LoadingScreen';
import type {ErrorResponse} from '../../http/Response';
import type {TwoState} from '../../state/reducers';
import {persistor} from '../../state/reducers';
import {selectTags} from '../store/selectors';
import {storeTags} from '../store';

import {DeleteTagIcon} from './DeleteTag';
import {EditTagIcon} from './EditTag';
import {TagDate} from './TagDate';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const mapStateToProps = (state: TwoState) => ({
  tags: selectTags(state.tags),
});

const connector = connect(mapStateToProps);
type ConnectorProps = ConnectedProps<typeof connector>;

type TagScreenProps = ConnectorProps & {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TagScreen'>;
};

export const TagScreen = ({tags, dispatch}: TagScreenProps) => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    new LoadingStatus(true, false),
  );

  const refreshTags = async (displayRefresh = false) => {
    setLoadingStatus(loadingStatus.beginLoading(displayRefresh));

    TagService.getTags()
      .then(async (tags: Tag[]) => {
        dispatch(storeTags(tags));
        setLoadingStatus(loadingStatus.endLoading());
        persistor.persist();
      })
      .catch((e: ErrorResponse) => {
        setLoadingStatus(loadingStatus.endLoading(e.reason));
      });
  };

  useEffect(() => {
    refreshTags();
  }, []);

  return (
    <Wrapper>
      <NoWrapContainer>
        <FlatList
          data={tags}
          contentContainerStyle={{paddingBottom: 100}}
          ListHeaderComponent={() => (
            <TagHeader
              onCreateTag={() => refreshTags()}
              isEmpty={tags === []}
            />
          )}
          renderItem={({item}) => (
            <TagItem tag={item} onDelete={refreshTags} onUpdate={refreshTags} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{flex: 1, height: 2, backgroundColor: Colors.LIGHT}} />
          )}
          keyExtractor={(tag: Tag) => tag.name}
          ListEmptyComponent={() => (
            <EmptyTagsComponent loadingStatus={loadingStatus} />
          )}
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={loadingStatus.displayRefresh}
              onRefresh={() => refreshTags(true)}
            />
          }
        />
      </NoWrapContainer>
      <Footer active="TagScreen" />
    </Wrapper>
  );
};

export default connector(TagScreen);

type TagHeaderProps = {
  onCreateTag: (tag: Tag) => void;
  isEmpty: boolean;
};

const TagHeader = ({onCreateTag, isEmpty}: TagHeaderProps) => (
  <>
    <Heading>Tags</Heading>
    <NewTagButton
      onCreated={onCreateTag}
      placeholder="Name of your new tag..."
    />
    {!isEmpty && (
      <Text style={s.label}>
        Select a tag below to rename, recolour, or delete.
      </Text>
    )}
  </>
);

type TagItemProps = {
  tag: Tag;
  onDelete: () => void;
  onUpdate: () => void;
};

const TagItem = ({tag, onDelete, onUpdate}: TagItemProps) => {
  return (
    <View style={s.item} accessibilityLabel="A tag owned by the couple">
      <View style={s.headerContainer}>
        <View style={s.nameContainer}>
          <View style={[s.circle, {backgroundColor: tag.color}]} />
          <Text style={s.subheading}>{tag.name}</Text>
          <Text style={s.memoryCount}>{tag.memoryCount || ''}</Text>
        </View>
        <View style={s.iconsContainer}>
          <EditTagIcon
            tag={tag}
            onUpdated={() => onUpdate()}
            style={{marginRight: 15}}
          />
          <DeleteTagIcon tag={tag} onDeleted={() => onDelete()} />
        </View>
      </View>
      <TagDate tag={tag} />
    </View>
  );
};

const EmptyTagsComponent = ({
  loadingStatus,
}: {
  loadingStatus: LoadingStatus;
}) => {
  if (loadingStatus.loading) {
    return null;
  }

  return (
    <>
      <Text style={{textAlign: 'center', color: Colors.REGULAR, marginTop: 40}}>
        {loadingStatus.error != null
          ? 'Sorry, we were unable to load your tags.\nPlease try again soon.'
          : // eslint-disable-next-line max-len
            'Tags are used to group closely related memories together. Think "21st Birthday", or "Wedding". Try creating one now!'}
      </Text>
    </>
  );
};

const s = StyleSheet.create({
  label: {
    color: Colors.REGULAR,
    marginLeft: 5,
    marginTop: 20,
  },
  item: {
    marginTop: 20,
    marginBottom: 20,
  },
  subheading: {
    color: Colors.DARK,
    fontSize: 25,
    fontFamily: 'Montserrat-Bold',
  },
  memoryCount: {
    color: Colors.FADED,
    fontSize: 25,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 7,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    flexGrow: 1,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginLeft: 30,
  },
});
