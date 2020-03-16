import React from 'react';
import {connect} from 'react-redux';
import {NoScrollWrapperContainer} from '../views/View';
import {Text, TouchableOpacity} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {NavigationStackProp} from 'react-navigation-stack';
import {User} from '../authentication/UserModel';
import {Memories} from '../memories/Memories';

type HomeScreenProps = {
    navigation: NavigationStackProp,
    user: User
}

const HomeScreen = ({navigation, user}: HomeScreenProps) => {
    const logout = () => navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LogoutScreen'})]
        })
    );

    return <NoScrollWrapperContainer>
        <Memories/>
        <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
    </NoScrollWrapperContainer>;
};

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null
};

const mapStateToProps = (state: any) => ({user: state['user']});

export default connect(mapStateToProps)(HomeScreen);
export {HomeScreen};