import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {getMemories} from './MemoryService';
import {Memory} from './MemoryModels';
import Colors from '../Colors';
import {MemoryDate, MemoryImageCount, MemoryLocation, MemoryVideoCount} from './MemoryIcons';
import {GridIcon, GroupedIcon, TimelineIcon} from './MemoryHeaderIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {InputCardButton} from '../forms/InputCardButton';
import {Heading} from '../home/Heading';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Router';
import {useNavigation} from '@react-navigation/native';

export const Memories = () => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [memories, setMemories] = useState<Memory[]>([]);
    let memoryFlatListRef: FlatList<Memory> | null;

    const refreshMemories = () => {
        getMemories().then(memories => {
            setMemories(memories);
            setRefreshing(false);
        });
    };

    const scrollToTop = () => memoryFlatListRef != null && memoryFlatListRef.scrollToOffset({
        offset: 75,
        animated: true
    });

    useEffect(() => {
        refreshMemories();
    }, []);

    return <FlatList
        data={memories}
        ref={ref => memoryFlatListRef = ref}
        onContentSizeChange={scrollToTop}
        renderItem={MemoryItem}
        keyExtractor={i => i.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={MemoryHeader}
        ListEmptyComponent={EmptyMemoriesComponent}

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

const MemoryHeader = () => {
    const {navigate} = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (<>
        <InputCardButton style={{marginTop: 20}}>
            <EvilIcon name="search" style={{fontSize: 20, paddingRight: 10, color: Colors.REGULAR}}/>
            <Text style={{color: Colors.REGULAR}}>Find memories...</Text>
        </InputCardButton>

        <Heading>Memories</Heading>

        <InputCardButton style={{marginTop: 10}} onClick={() => navigate('NewMemoryScreen')}>
            <SimpleLineIcon name="pencil" style={{fontSize: 13, paddingRight: 10, color: Colors.REGULAR}}/>
            <Text style={{color: Colors.REGULAR}}>Title of your new memory...</Text>
        </InputCardButton>

        <View style={{marginTop: 20, flexDirection: 'row'}}>
            <TimelineIcon focused/>
            <GroupedIcon/>
            <GridIcon/>
        </View>
    </>);
};

const MemoryItem = ({item}: { item: Memory }) => (<View style={containers.item}>
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
            source={{uri: item?.displayContent?.fileKey}}/>
    </View>
</View>);

const EmptyMemoriesComponent = () => (<><Text style={{textAlign: 'center', color: Colors.REGULAR, marginTop: 40}}>
    You don't have any memories. Create some!
</Text></>);

const containers = StyleSheet.create({
    item: {
        marginTop: 10,
        marginBottom: 20
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