import 'react-native';
import React from 'react';
import {HomeScreen} from '../../src/home/HomeScreen';
import {User} from '../../src/authentication/UserModel';
import {shallow, mount} from 'enzyme';
import {CommonActions} from '@react-navigation/native';

describe('HomeScreen', () => {
    jest.mock('@react-navigation/native', () => ({
        useNavigation: () => ({dispatch: jest.fn(), navigate: jest.fn()})
    }));

    let tb: HomeScreenTestBed;

    beforeEach(() => tb = new HomeScreenTestBed());
    
    test('clicking logout should navigate to LogoutScreen', () => {
        tb.wrapper.find('TouchableOpacity').prop<() => void>('onPress')();
        expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
        expect(tb.dispatchFn).toHaveBeenCalledWith(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'LogoutScreen'}]
            })
        );
    });
});

class HomeScreenTestBed {
    dispatchFn = jest.fn();
    user: User = {uid: 1, pid: 2, cid: 3};
    wrapper = shallow(<HomeScreen navigation={{dispatch: this.dispatchFn} as any} user={this.user}/>);
}
