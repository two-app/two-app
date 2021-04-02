import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

import {TimelineComponent} from '../home/TimelineConstants';

import {selectAllTags, storeTags} from './store';
import {Tag} from './Tag';
import {getTags} from './TagService';

export const GroupedTimelineComponent = (): TimelineComponent<Tag> => ({
  fetch: getTags,
  select: selectAllTags,
  dispatcher: storeTags,
  render: (tag) => <TagItem tag={tag} />,
  key: (tag) => `tag-${tag.tid}`,
});

const TagItem = ({tag}: {tag: Tag}) => {
  return (
    <TouchableOpacity
      style={{marginVertical: 20}}
      accessibilityLabel={`Open tag '${tag.name}'`}>
      <Text>{tag.name}</Text>
    </TouchableOpacity>
  );
};
