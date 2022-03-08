import {TouchableOpacity, Text} from 'react-native';
import { TimelineComponent } from '../timelines/UseTimelineHook';

import {Tag} from './Tag';
import {getTags} from './TagService';
import {TagState, useTagStore} from './TagStore';

export const GroupedTimelineComponent = (): TimelineComponent<Tag, TagState> => ({
  fetch: getTags,
  store: useTagStore,
  render: tag => <TagItem tag={tag} />,
  key: tag => `tag-${tag.tid}`,
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
