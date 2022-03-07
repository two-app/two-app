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
import {useTagStore} from './TagStore';

type SelectTagProps = ViewProps & {
  onTagChange: (tag: undefined | Tag) => void;
  initialValue?: Tag;
};

// TODO rename to TagInput
export const SelectTag = (props: SelectTagProps) => {
  const [tag, _setTag] = useState<Tag | undefined>(props.initialValue);
  const tagStore = useTagStore();
  const {navigate} = useNavigation<Routes>();

  useEffect(() => {
    getTags().then(tagStore.setAll);
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
            navigate('TagManagementScreen', {onSubmit: setTag});
          }
        }}>
        <NonEditableInput
          placeholder="Optional tag, e.g Anniversary"
          icon={{provider: IonIcon, name: 'pricetag-outline'}}
          value={tag?.name}
          isValid={() => true}
        />
      </TouchableOpacity>
      {tagStore.all.length > 0 && (
        <>
          <Text style={{color: Colors.REGULAR, marginLeft: 5, marginTop: 10}}>
            Or, select from an existing tag...
          </Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}
            horizontal={true}
            data={tagStore.all}
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
