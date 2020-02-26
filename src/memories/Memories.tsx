import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {getMemories} from './MemoryService';
import {Memory} from './MemoryModels';
import Colors from '../Colors';
import {MemoryDate, MemoryImageCount, MemoryLocation, MemoryVideoCount} from './MemoryIcons';

export const Memories = () => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [memories, setMemories] = useState<Memory[]>([]);

    const refreshMemories = () => {
        getMemories().then(memories => {
            setMemories(memories);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        refreshMemories();
    }, []);

    return <FlatList
        data={memories}
        renderItem={MemoryItem}
        keyExtractor={i => i.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={MemoryHeader}
        refreshControl={
            <RefreshControl
                colors={['#9Bd35A', '#689F38']}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    refreshMemories();
                }}
            />
        }
    />;
};

const MemoryHeader = () => <>
    <Text style={{
        color: Colors.VERY_DARK,
        fontSize: 35,
        fontFamily: 'Montserrat-Bold',
        marginTop: 20,
        marginBottom: -10
    }}>Memories</Text>
</>;

const MemoryItem = ({item}: { item: Memory }) => <View style={containers.item}>
    <Text style={s.heading}>{item.title}</Text>
    <View style={s.spacedRow}>
        <MemoryLocation location={item.location}/>
        <MemoryDate date={item.date}/>
    </View>
    <View style={s.row}>
        {item.pictureCount > 0 && <MemoryImageCount pictureCount={item.pictureCount}/>}
        {item.videoCount > 0 && <MemoryVideoCount videoCount={item.videoCount} pad={item.pictureCount > 0}/>}
    </View>
    <View style={containers.image}>
        <ImageBackground
            style={{width: '100%', height: '100%'}}
            source={{uri: item.content[0].url}}/>
    </View>
</View>;

const containers = StyleSheet.create({
    item: {
        marginTop: 40
    },
    image: {
        flexDirection: 'row',
        flex: 1,
        height: 200,
        marginTop: 10
    }
});

const s = StyleSheet.create({
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
    }
});