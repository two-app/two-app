

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {HomeScreen} from "../../src/home/HomeScreen";
import {User} from "../../src/authentication/UserModel";
import {shallow} from "enzyme";
import {NavigationActions, StackActions} from "react-navigation";

describe('HomeScreen', () => {
    const user = new User(1, 2, 3);

    test('should maintain snapshot', () => expect(renderer.create(<HomeScreen user={user}/>)).toMatchSnapshot());

    let tb: HomeScreenTestBed;

    beforeEach(() => tb = new HomeScreenTestBed());

    test('clicking logout should navigate to LogoutScreen', () => {
        tb.wrapper.find("TouchableOpacity").prop("onPress")();
        expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
        expect(tb.dispatchFn).toHaveBeenCalledWith(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LogoutScreen'})]
        }));
    });
});

class HomeScreenTestBed {
    dispatchFn = jest.fn();
    user = new User(1, 2, 3);
    wrapper = shallow(<HomeScreen navigation={{dispatch: this.dispatchFn}} user={this.user}/>);
}
