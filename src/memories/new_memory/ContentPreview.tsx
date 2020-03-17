import {Image as ImageType} from "react-native-image-crop-picker";
import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../../Colors';

const ContentPreview = ({content}: { content: ImageType[] }) => (<>
    <Text style={s.previewTitle}>{content.length} images and
        videos chosen.</Text>

    <View style={s.previewContainer}>
        {content.map((image: ImageType) =>
            <Image source={{uri: 'file://' + image.path}} style={s.previewImage} key={image.path}/>
        )}
    </View>
</>);

const s = StyleSheet.create({
    previewTitle: {
        marginTop: 20,
        color: Colors.REGULAR,
        textAlign: 'center'
    },
    previewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    previewImage: {
        width: 70,
        height: 70,
        marginTop: 20
    }
});

export {ContentPreview};