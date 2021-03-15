import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, RefreshControl} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlatList} from 'react-native-gesture-handler';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';

import Colors from '../../Colors';
import {RootStackParamList} from '../../../Router';
import {Footer} from '../../home/Footer';
import {Wrapper, NoWrapContainer} from '../../views/View';
import {Heading} from '../../home/Heading';
import * as TagService from '../TagService';
import {Tag} from '../Tag';
import {NewTagButton} from '../NewTagButton';

import {DeleteTagIcon} from './DeleteTag';
import {EditTagIcon} from './EditTag';

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
          renderItem={({item}) => (
            <TagItem
              tag={item}
              onDelete={() => refreshTags()}
              onUpdate={() => refreshTags()}
            />
          )}
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
  onDelete: () => void;
  onUpdate: () => void;
};

const TagItem = ({tag, onDelete, onUpdate}: TagItemProps) => {
  return (
    <View style={s.item} accessibilityLabel="A tag owned by the couple">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[s.circle, {backgroundColor: tag.color}]} />
          <Text style={s.subheading}>{tag.name}</Text>
          <Text style={s.memoryCount}>{tag.memoryCount || ''}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <EditTagIcon tag={tag} onUpdated={onUpdate} />
          <DeleteTagIcon tag={tag} onDeleted={onDelete} />
        </View>
      </View>
      {tag.startDate != null && <DateRender tag={tag} />}
    </View>
  );
};

const DateRender = ({tag}: {tag: Tag}) => {
  const fmt = (d?: string) =>
    d == null ? '' : moment(d).format('MMMM Do YYYY');

  let text = 'This tag has no memories.';

  if (tag.startDate != null) {
    const startDate = fmt(tag.startDate);
    const endDate = fmt(tag.endDate);

    if (startDate === endDate) {
      text = startDate;
    } else {
      text = `${startDate} - ${endDate}`;
    }
  }

  return <Text style={s.date}>{text}</Text>;
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
  },
  date: {
    color: Colors.REGULAR,
    fontSize: 14,
    marginTop: 10,
  },
});
