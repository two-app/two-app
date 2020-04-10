import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { NewTagButton, TagCard } from './NewTagButton';
import { Tag } from './Tag';
import { getTags } from './TagService';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '../Colors';
import { TagButton } from './TagButton';

type SelectTagProps = {
  onTagChange: (tag: undefined | Tag) => void
};

export const SelectTag = ({ onTagChange }: SelectTagProps) => {
  const [selected, setSelected] = useState<Tag>();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    getTags().then(setAvailableTags);
  }, []);

  // updates internal state and propogates tag
  const updateSelectedTag = (tag: undefined | Tag) => {
    setSelected(tag);
    onTagChange(tag);
  }

  const tagCreated = (tag: Tag) => {
    setAvailableTags([tag, ...availableTags]);
    updateSelectedTag(tag)
  };

  return (
    <>
      {selected != null ?
        <TagCard tag={selected} onDeselect={() => updateSelectedTag(undefined)} />
        :
        <NewTagButton onCreated={tagCreated} />
      }
      {availableTags.length > 0 &&
        <>
          <Text style={s.label}>Or, select from an existing tag...</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
            horizontal={true}
            data={availableTags}
            keyExtractor={tag => tag.name}
            renderItem={({ item }) => (
              <TagButton tag={item} onClick={(tag: Tag) => {
                if (tag == selected) {
                  updateSelectedTag(undefined);
                } else {
                  updateSelectedTag(tag);
                }
              }} focused={selected == item} />
            )}
          />
        </>
      }
    </>
  )
}

const s = StyleSheet.create({
  label: {
    color: Colors.REGULAR,
    marginLeft: 5,
    marginTop: 10
  }
});