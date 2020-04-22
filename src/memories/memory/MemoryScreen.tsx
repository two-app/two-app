import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Memory, Content } from '../MemoryModels';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../Router';
import { RouteProp } from '@react-navigation/native';
import { Container } from '../../views/View';
// @ts-ignore
import { createImageProgress } from 'react-native-image-progress';
// @ts-ignore
import FastImage from 'react-native-fast-image';
const Image = createImageProgress(FastImage);
import { getMemory, getMemoryContent } from '../MemoryService';
import ImageView from "react-native-image-viewing";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MemoryDisplayView } from '../MemoryDisplayView';


type MemoryScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'MemoryScreen'>,
    route: RouteProp<RootStackParamList, 'MemoryScreen'>;
};

const MemoryScreen = ({ route }: MemoryScreenProps) => {
    const [memory, updateMemory] = useState<Memory>(route.params.memory);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [content, setContent] = useState<Content[]>([]);
    const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

    const refreshMemory = () => {
        getMemory(memory.id).then((updatedMemory: Memory) => {
            updateMemory(updatedMemory);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        getMemoryContent(memory.id).then(setContent);
    }, []);

    const numColumns: number = 4;
    const remainder: number = content.length % numColumns;
    const fill: number = numColumns - remainder;
    const paddedArray = content.concat(new Array(fill).fill({}))

    return (
        <Container>
            <ImageView
                images={content.map(c => ({ uri: c.fileKey }))}
                // @ts-ignore
                imageIndex={galleryIndex}
                visible={galleryIndex != null}
                onRequestClose={() => setGalleryIndex(null)}
            />
            <FlatList
                numColumns={numColumns}
                data={paddedArray}
                renderItem={({ item, index }) => {
                    if (index >= content.length) {
                        return <EmptyItem />;
                    } else {
                        return <ContentItem item={item} index={index} onClick={setGalleryIndex} />;
                    }
                }}
                columnWrapperStyle={{ margin: -5 }}
                ListHeaderComponentStyle={{ marginBottom: 10 }}
                keyExtractor={item => item.fileKey}
                ListHeaderComponent={() => <MemoryDisplayView memory={memory} />}
                refreshControl={
                    <RefreshControl
                        colors={['#9Bd35A', '#689F38']}
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            refreshMemory();
                        }}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </Container>
    )
};

type ContentItemProps = {
    item: Content,
    index: number,
    onClick: (index: number) => void
};

const ContentItem = ({ item, index, onClick }: ContentItemProps) => (
    <View style={{ flex: 1, aspectRatio: 1, padding: 5, marginTop: 10 }}>
        <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => onClick(index)}>
            <Image
                source={{ uri: item.fileKey }}
                style={{ flex: 1 }}
            />
        </TouchableOpacity>
    </View>
);

const EmptyItem = () => (
    <View style={{ flex: 1, aspectRatio: 1, margin: 5 }}></View>
)

export { MemoryScreen };