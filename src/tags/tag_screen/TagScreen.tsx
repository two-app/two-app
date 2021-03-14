import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, RefreshControl} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlatList} from 'react-native-gesture-handler';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

import Colors from '../../Colors';
import {RootStackParamList} from '../../../Router';
import {Footer} from '../../home/Footer';
import {Wrapper, NoWrapContainer} from '../../views/View';
import {Heading} from '../../home/Heading';
import * as TagService from '../TagService';
import {Tag} from '../Tag';
import {NewTagButton} from '../NewTagButton';

type TagScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'TagScreen'>;
};

type LoadingStatus = {
  loading: boolean;
  refreshing: boolean;
  loadingError: boolean;
};

export const TagScreen = ({}: TagScreenProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({
    loading: false,
    refreshing: false,
    loadingError: false,
  });

  const refreshTags = async (refreshing = false) => {
    setLoadingStatus({loading: true, refreshing, loadingError: false});

    TagService.getTags()
      .then((tags: Tag[]) => {
        setLoadingStatus({
          loading: false,
          refreshing: false,
          loadingError: false,
        });
        setTags(tags);
      })
      .catch((_) => {
        setLoadingStatus({
          loading: false,
          refreshing: false,
          loadingError: true,
        });
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
              isEmpty={tags.length === 0}
            />
          )}
          renderItem={({item}) => <TagItem tag={item} />}
          ItemSeparatorComponent={() => (
            <View style={{flex: 1, height: 2, backgroundColor: Colors.LIGHT}} />
          )}
          testID="menu"
          keyExtractor={(tag) => tag.name}
          ListEmptyComponent={() => (
            <EmptyTagsComponent loadingStatus={loadingStatus} />
          )}
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={loadingStatus.refreshing}
              onRefresh={() => refreshTags(true)}
            />
          }
        />
      </NoWrapContainer>
      <Footer active="TagScreen" />
    </Wrapper>
  );
};

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
};

const TagItem = ({tag}: TagItemProps) => {
  return (
    <View style={s.item} accessibilityLabel="A tag owned by the couple">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={s.subheading}>{tag.name}</Text>
          <View style={[s.circle, {backgroundColor: tag.color}]} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SimpleLineIcon
            name="pencil"
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors.VERY_DARK,
              marginRight: 20,
              marginLeft: 20,
            }}
          />
          <EvilIcon
            name="trash"
            style={{fontSize: 30, color: Colors.DARK_SALMON}}
          />
        </View>
      </View>
    </View>
  );
};

const EmptyTagsComponent = ({
  loadingStatus,
}: {
  loadingStatus: LoadingStatus;
}) => {
  return (
    <>
      <Text style={{textAlign: 'center', color: Colors.REGULAR, marginTop: 40}}>
        {loadingStatus.loadingError
          ? 'Sorry, we were unable to load your tags.\nPlease try again soon.'
          : loadingStatus.loading
          ? 'Loading your tags...'
          : 'Tags are used to group closely related memories together. Think "21st Birthday", or "Wedding". Try creating one now!'}
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
  circle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    marginLeft: 10,
  },
});
