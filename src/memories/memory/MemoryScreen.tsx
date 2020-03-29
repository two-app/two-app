import React, {useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {Memory} from '../MemoryModels';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../Router';
import {RouteProp} from '@react-navigation/native';
import {ScrollViewContainer} from '../../views/View';
import Colors from '../../Colors';
import {MemoryDate, MemoryImageCount, MemoryLocation, MemoryVideoCount} from '../MemoryIcons';
// @ts-ignore
import Image from 'react-native-image-progress';
// @ts-ignore
import Progress from 'react-native-progress/Circle';
import {getMemory} from '../MemoryService';

type MemoryScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'MemoryScreen'>,
    route: RouteProp<RootStackParamList, 'MemoryScreen'>;
}

const MemoryScreen = ({navigation, route}: MemoryScreenProps) => {
    const [memory, updateMemory] = useState<Memory>(route.params.memory);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const refreshMemory = () => {
        getMemory(memory.id).then((updatedMemory: Memory) => {
            updateMemory(updatedMemory);
            setRefreshing(false);
        });
    };

    return (
        <ScrollViewContainer
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
        >
            <View style={s.container}>
                <Text style={s.heading}>{memory.title}</Text>
                <View style={s.spacedRow}>
                    <MemoryLocation location={memory.location}/>
                    <MemoryDate date={memory.date}/>
                </View>
                <View style={s.row}>
                    {memory.imageCount > 0 && <MemoryImageCount pictureCount={memory.imageCount}/>}
                    {memory.videoCount > 0 &&
                    <MemoryVideoCount videoCount={memory.videoCount} pad={memory.imageCount > 0}/>}
                </View>
                {memory.displayContent != null && <View style={s.displayImageContainer}>
                    <Image
                        style={{width: '100%', height: '100%'}}
                        source={{uri: memory.displayContent.fileKey}}
                        indicator={Progress}
                        indicatorProps={{
                            borderWidth: 1,
                            borderColor: Colors.REGULAR,
                            color: Colors.REGULAR
                        }}
                    />
                </View>}
            </View>
        </ScrollViewContainer>
    );
};

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
    }
});

export {MemoryScreen};