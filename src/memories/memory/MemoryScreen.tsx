import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Memory, Content } from '../MemoryModels';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../Router';
import { RouteProp } from '@react-navigation/native';
import { ScrollViewContainer, Wrapper, ContainerView } from '../../views/View';
import Colors from '../../Colors';
import { MemoryDate, MemoryImageCount, MemoryLocation, MemoryVideoCount } from '../MemoryIcons';
// @ts-ignore
import Image from 'react-native-image-progress';
// @ts-ignore
import Progress from 'react-native-progress/Circle';
import { getMemory, getMemoryContent } from '../MemoryService';

type MemoryScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'MemoryScreen'>,
    route: RouteProp<RootStackParamList, 'MemoryScreen'>;
}

const MemoryScreen = ({ navigation, route }: MemoryScreenProps) => {
    const [memory, updateMemory] = useState<Memory>(route.params.memory);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [content, setContent] = useState<Content[]>([]);

    const refreshMemory = () => {
        getMemory(memory.id).then((updatedMemory: Memory) => {
            updateMemory(updatedMemory);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        getMemoryContent(memory.id).then(setContent);
    }, [])

    const numColumns: number = 4;
    const remainder: number = content.length % numColumns;
    const fill: number = numColumns - remainder;
    const paddedArray = content.concat(new Array(fill).fill({}))

    return (
        <ContainerView>
            <FlatList
                numColumns={numColumns}
                data={paddedArray}
                renderItem={({ item, index }) => {
                    if (index >= content.length) {
                        return <EmptyItem />;
                    } else {
                        return <ContentItem item={item} />;
                    }
                }}
                columnWrapperStyle={{ margin: -5 }}
                ListHeaderComponentStyle={{ marginBottom: 10 }}
                keyExtractor={item => item.fileKey}
                ListHeaderComponent={() => <MemoryHeader memory={memory} />}
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
        </ContainerView>
    )
};

type MemoryHeaderProps = {
    memory: Memory
}

const MemoryHeader = ({ memory }: MemoryHeaderProps) => (
    <View style={s.container}>
        <Text style={s.heading}>{memory.title}</Text>
        <View style={s.spacedRow}>
            <MemoryLocation location={memory.location} />
            <MemoryDate date={memory.date} />
        </View>
        <View style={s.row}>
            {memory.imageCount > 0 && <MemoryImageCount pictureCount={memory.imageCount} />}
            {memory.videoCount > 0 &&
                <MemoryVideoCount videoCount={memory.videoCount} pad={memory.imageCount > 0} />}
        </View>
        {memory.displayContent != null && <View style={s.displayImageContainer}>
            <Image
                style={{ width: '100%', height: '100%' }}
                source={{ uri: memory.displayContent.fileKey }}
                indicator={Progress}
                indicatorProps={{
                    borderWidth: 1,
                    borderColor: Colors.REGULAR,
                    color: Colors.REGULAR
                }}
            />
        </View>}
    </View>
);

const ContentItem = ({ item }: { item: Content }) => {
    return (
        <View style={{ flex: 1, aspectRatio: 1, padding: 5, marginTop: 10 }}>
            <Image
                source={{ uri: item.fileKey }}
                style={{ flex: 1 }}
            />
        </View>
    )
}

const EmptyItem = () => (
    <View style={{ flex: 1, aspectRatio: 1, margin: 5 }}></View>
)

MemoryScreen.navigationOptions = {
    title: 'Memory',
    header: null
};

const s = StyleSheet.create({
    container: {
        marginTop: 20
    },
    heading: {
        color: Colors.DARK,
        fontSize: 25,
        fontFamily: 'Montserrat-Bold'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    spacedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    displayImageContainer: {
        width: '100%',
        height: 200,
        marginTop: 20
    },
    contentRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    }
});

export { MemoryScreen };