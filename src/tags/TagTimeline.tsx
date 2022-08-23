import {TouchableOpacity, Text} from 'react-native';
import {TimelineComponent} from '../timelines/UseTimelineHook';

import {Tag} from './Tag';
import {getTags} from './TagService';
import {TagState, useTagStore} from './TagStore';

export const GroupedTimelineComponent = (): TimelineComponent<
  Tag,
  TagState
> => ({
  fetch: getTags,
  useStore: useTagStore,
  render: tag => <TagItem tag={tag} />,
  key: tag => `tag-${tag.tid}`,
});

//[{"tid":"d123d58a-9009-4eca-97c4-671465875345","name":"Anniversary","color":"#0496ff","createdAt":"2022-08-22T22:31:46.966069Z","updatedAt":"2022-08-22T22:31:46.966069Z","memoryCount":1,"startDate":"2022-08-22T22:28:15.629Z","endDate":"2022-08-22T22:28:15.629Z","displayContent":{"suffix":"display","extension":"jpg","mime":"image/jpeg","width":1920,"height":1440,"size":1209834,"duration":null}}

const TagItem = ({tag}: {tag: Tag}) => {
  return (
    <TouchableOpacity
      style={{marginVertical: 20}}
      accessibilityLabel={`Open tag '${tag.name}'`}>
      <Text>{tag.name}</Text>
    </TouchableOpacity>
  );
};
