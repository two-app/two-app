import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getMemories } from './MemoryService';
import { Memory } from './MemoryModels';
import Colors from '../Colors';
import { GridIcon, GroupedIcon, TimelineIcon } from './MemoryHeaderIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { Heading } from '../home/Heading';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Router';
import { useNavigation } from '@react-navigation/native';
import { MemoryDisplayView } from './MemoryDisplayView';
import { TouchableCard } from '../forms/Card';

type MemoryEffect = {
    loading: boolean,
    refreshing: boolean,
    loadingError: boolean,
    memories: Memory[]
};

export const Memories = () => {
    const [effect, setEffect] = useState<MemoryEffect>({
        loading: true,
        refreshing: false,
        loadingError: false,
        memories: []
    });

    let memoryFlatListRef: FlatList<Memory> | null;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const refreshMemories = () => {
        setEffect(prev => ({ ...prev, loading: true }));
        getMemories()
            .then(memories => setEffect(prev => ({...prev, memories})))
            .catch(() => setEffect(prev => ({...prev, loadingError: true})))
            .finally(() => setEffect(prev => ({...prev, loading: false, refreshing: false})));
    };

    const scrollToTop = () => memoryFlatListRef != null && memoryFlatListRef.scrollToOffset({
        offset: 75,
        animated: true
    });

    useEffect(() => {
        refreshMemories();
    }, []);

    return (
        <FlatList
            data={effect.memories}
            ref={ref => memoryFlatListRef = ref}
            onContentSizeChange={scrollToTop}
            renderItem={item => (<MemoryItemNavigation navigation={navigation} item={item.item} />)}
            keyExtractor={i => i.id.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={MemoryHeader}
            ListEmptyComponent={() => <EmptyMemoriesComponent effect={effect} />}

            refreshControl={
                <RefreshControl
                    colors={['#9Bd35A', '#689F38']}
                    refreshing={effect.refreshing}
                    onRefresh={() => {
                        setEffect(prev => ({ ...prev, refreshing: true }));
                        refreshMemories();
                    }}
                />
            }
        />
    );
};

const MemoryHeader = () => {
    const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (<>
        <TouchableCard style={{ marginTop: 20 }} onPress={() => navigate('SearchScreen')}>
            <EvilIcon name="search" style={{ fontSize: 20, paddingRight: 10, color: Colors.REGULAR }} />
            <Text style={{ color: Colors.REGULAR }}>Find memories...</Text>
        </TouchableCard>

        <Heading>Memories</Heading>

        <TouchableCard style={{ marginTop: 10 }} onPress={() => navigate('NewMemoryScreen')}>
            <SimpleLineIcon name="pencil" style={{ fontSize: 13, paddingRight: 10, color: Colors.REGULAR }} />
            <Text style={{ color: Colors.REGULAR }}>Title of your new memory...</Text>
        </TouchableCard>

        <View style={{ marginTop: 20, flexDirection: 'row' }}>
            <TimelineIcon focused />
            <GroupedIcon />
            <GridIcon />
        </View>
    </>);
};

type MemoryItemNavigationProps = {
    item: Memory,
    navigation: StackNavigationProp<RootStackParamList>
}

const MemoryItemNavigation = ({ item, navigation }: MemoryItemNavigationProps) => (
    <TouchableOpacity style={containers.item} onPress={() => navigation.navigate('MemoryScreen', { memory: item })}>
        <MemoryDisplayView memory={item} />
    </TouchableOpacity>
);

const EmptyMemoriesComponent = ({ effect }: { effect: MemoryEffect }) => (
    <>
        <Text style={{ textAlign: 'center', color: Colors.REGULAR, marginTop: 40 }}>
            {effect.loadingError != null ?
                `Sorry, we were unable to load your memories.\nTry again soon.`
                :
                (effect.loading ? 'Loading your memories...' : `You don't have any memories. Create some!`)
            }
        </Text>
    </>
);

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

