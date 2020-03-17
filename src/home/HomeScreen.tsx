import React from 'react';
import {connect} from 'react-redux';
import {NoScrollWrapperContainer} from '../views/View';
import {Text, TouchableOpacity} from 'react-native';
import {User} from '../authentication/UserModel';
import {Memories} from '../memories/Memories';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Router';
import {CommonActions} from '@react-navigation/native';

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'HomeScreen'>,
    user: User
}

const HomeScreen = ({navigation, user}: HomeScreenProps) => {
    const logout = () => navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{name: 'LogoutScreen'}]
        })
    );

    return <NoScrollWrapperContainer>
        <Memories/>
        <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
    </NoScrollWrapperContainer>;
};

const mapStateToProps = (state: any) => ({user: state['user']});

export default connect(mapStateToProps)(HomeScreen);
export {HomeScreen};