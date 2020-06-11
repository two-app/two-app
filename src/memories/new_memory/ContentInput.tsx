import ImagePicker, {Image, Options} from 'react-native-image-crop-picker';
import {Text, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Colors from '../../Colors';
import React from 'react';
import {FormStyle} from './FormStyles';
import {TouchableCard} from '../../forms/Card';

type ContentInputProps = {
  setContent: (content: Image[]) => void;
  onOpen: () => void;
  onClose: () => void;
};

const ContentInput = ({setContent, onOpen, onClose}: ContentInputProps) => {
  const selectMedia = () => {
    onOpen();

    const options: Options = {
      multiple: true,
      maxFiles: 10,
      compressImageMaxWidth: 1800,
      compressImageMaxHeight: 1800,
    };

    ImagePicker.openPicker(options)
      .then((value: Image | Image[]) =>
        Array.isArray(value) ? setContent(value) : setContent([value]),
      )
      .catch((e) => console.log('Failed to select media.', e))
      .finally(onClose);
  };

  return (
    <TouchableCard style={FormStyle.card} onPress={() => selectMedia()}>
      <View style={FormStyle.iconContainer}>
        <IonIcon
          name="md-images"
          style={{fontSize: 13, color: Colors.REGULAR}}
        />
      </View>
      <Text>Select images and videos</Text>
    </TouchableCard>
  );
};

export {ContentInput};
