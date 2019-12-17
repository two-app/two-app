// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import LoginScreen from "../../src/authentication/LoginScreen";
import {shallow} from "enzyme";

test('should maintain snapshot', () => expect(renderer.create(<LoginScreen/>).toJSON()).toMatchSnapshot());

test('Render has Sign In header', () => {
    const wrapper = shallow(<LoginScreen/>);
    const header = wrapper.find("Text").first();

    expect(header.render().text()).toEqual("Sign In");
});

test('it should navigate when Sign Up is clicked', () => {
    const navigate = jest.fn();
    const wrapper = shallow(<LoginScreen navigation={{navigate}}/>);

    expect(wrapper.exists("Button")).toBeTruthy();
    const signUpButton = wrapper.find("Button[title='Sign Up']").first();

    signUpButton.simulate('press');
    expect(navigate.mock.calls.length).toEqual(1);
    expect(navigate.mock.calls[0]).toEqual(['Register']);
});