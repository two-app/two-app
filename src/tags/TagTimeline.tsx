import {TouchableOpacity, Text} from 'react-native';

import {TimelineComponent} from '../home/TimelineConstants';

import {Tag} from './Tag';
import {getTags} from './TagService';
import {useTagStore} from './TagStore';

export const GroupedTimelineComponent = (): TimelineComponent<Tag> => ({
  fetch: getTags,
  store: useTagStore.getState,
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
