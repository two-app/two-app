import { useState, useEffect } from 'react';
import {Text, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import Colors from '../Colors';

import {NewTagButton, TagCard} from './NewTagButton';
import {Tag} from './Tag';
import {getTags} from './TagService';
import {TagButton} from './TagButton';

type SelectTagProps = {
  onTagChange: (tag: undefined | Tag) => void;
  initialValue?: Tag;
};

export const SelectTag = ({onTagChange, initialValue}: SelectTagProps) => {
  const [selected, setSelected] = useState<Tag | undefined>(initialValue);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags().then(setAvailableTags);
  }, []);

  // updates internal state and propogates tag
  const updateSelectedTag = (tag: undefined | Tag) => {
    setSelected(tag);
    onTagChange(tag);
  };

  const tagCreated = (tag: Tag) => {
    setAvailableTags([tag, ...availableTags]);
    updateSelectedTag(tag);
  };

  return (
    <>
      {selected != null ? (
        <TagCard
          tag={selected}
          onDeselect={() => updateSelectedTag(undefined)}
        />
      ) : (
        <NewTagButton onCreated={tagCreated} />
      )}
      {availableTags.length > 0 && (
        <>
          <Text style={s.label}>Or, select from an existing tag...</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}
            horizontal={true}
            data={availableTags}
            keyExtractor={tag => tag.name}
            renderItem={({item}) => (
              <TagButton
                tag={item}
                onClick={(tag: Tag) => {
                  if (tag.tid === selected?.tid) {
                    updateSelectedTag(undefined);
                  } else {
                    updateSelectedTag(tag);
                  }
                }}
                focused={item.tid === selected?.tid}
              />
            )}
          />
        </>
      )}
    </>
  );
};

const s = StyleSheet.create({
  label: {
    color: Colors.REGULAR,
    marginLeft: 5,
    marginTop: 10,
  },
});
