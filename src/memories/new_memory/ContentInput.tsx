import ImagePicker, { Image, Options } from 'react-native-image-crop-picker';
import { InputCardButton } from '../../forms/InputCardButton';
import { Text, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Colors from '../../Colors';
import React from 'react';
import { FormStyle } from './FormStyles';

const ContentInput = ({ setContent }: { setContent: Function }) => {
    const selectMedia = () => {
        const options: Options = {
            multiple: true,
            maxFiles: 10,
            compressImageMaxWidth: 1800,
            compressImageMaxHeight: 1800
        };
        ImagePicker.openPicker(options).then((value: Image | Image[]) => {
            console.log(value);
            Array.isArray(value) ? setContent(value) : setContent([value]);
        });
    };

    return (
        <InputCardButton style={FormStyle.card} onClick={() => selectMedia()}>
            <View style={FormStyle.iconContainer}>
                <IonIcon name="md-images" style={{ fontSize: 13, color: Colors.REGULAR }} />
            </View>
            <Text>Select images and videos</Text>
        </InputCardButton>
    );
};

export { ContentInput };