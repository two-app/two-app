// @flow

import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import LoginScreen from "../../src/authentication/LoginScreen";

test('should render correctly', () => {
    expect(renderer.create(<LoginScreen/>).toJSON()).toMatchSnapshot();
});