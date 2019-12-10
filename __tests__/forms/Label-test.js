// @flow

import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Label from "../../src/forms/Label";

test('should maintain snapshot', () => {
    expect(renderer.create(<Label text={"Test Label"}/>)).toMatchSnapshot();
});