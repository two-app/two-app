import {useState, useEffect} from 'react';
import {Text, FlatList, TouchableOpacity, View, ViewProps} from 'react-native';

import Colors from '../Colors';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {Tag} from './Tag';
import {getTags} from './TagService';
import {TagButton} from './TagButton';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../navigation/NavigationUtilities';
import {NonEditableInput} from '../forms/Input';

type SelectTagProps = ViewProps & {
  onTagChange: (tag: undefined | Tag) => void;
  initialValue?: Tag;
};

// TODO rename to TagInput
export const SelectTag = (props: SelectTagProps) => {
  const [tag, _setTag] = useState<Tag | undefined>(props.initialValue);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const navigation = useNavigation<Routes>();

  useEffect(() => {
    // TODO put tags in the redux store
    getTags().then(setAvailableTags);
  }, []);

  const setTag = (tag: undefined | Tag) => {
    _setTag(tag);
    props.onTagChange(tag);
  };

  return (
    <View {...props}>
      <TouchableOpacity
        onPress={() => {
          if (tag != null) {
            setTag(undefined);
          } else {
            navigation.navigate('TagManagementScreen', {
              onSubmit: (newTag: Tag) => {
                setAvailableTags([newTag, ...availableTags]);
                setTag(tag);
              },
            });
          }
        }}>
        <NonEditableInput
          placeholder="Optional tag, e.g Anniversary"
          icon={{provider: IonIcon, name: 'pricetag-outline'}}
          value={tag?.name}
          isValid={() => true}
        />
      </TouchableOpacity>
      {availableTags.length > 0 && (
        <>
          <Text style={{color: Colors.REGULAR, marginLeft: 5, marginTop: 10}}>
            Or, select from an existing tag...
          </Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}
            horizontal={true}
            data={availableTags}
            keyExtractor={tag => tag.name}
            renderItem={({item}) => (
              <TagButton
                tag={item}
                onClick={(updated: Tag) => {
                  if (updated.tid === tag?.tid) {
                    setTag(undefined);
                  } else {
                    setTag(updated);
                  }
                }}
                focused={item.tid === tag?.tid}
              />
            )}
          />
        </>
      )}
    </View>
  );
};
