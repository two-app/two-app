// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import {AcceptTermsScreen} from "../../src/authentication/register_workflow/AcceptTermsScreen";
import {HomeScreen} from "../../src/home/HomeScreen";

describe('HomeScreen', () => {
    test('should maintain snapshot', () => expect(renderer.create(<AcceptTermsScreen
        navigation={{getParam: jest.fn().mockReturnValue(HomeScreen)}}/>
    )).toMatchSnapshot());
});

class HomeScreenTestBed {
    wrapper = shallow(<HomeScreen user={}/>);
}