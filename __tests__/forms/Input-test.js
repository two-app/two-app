// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import Input from "../../src/forms/Input";

test('should maintain snapshot', () => {
    expect(renderer.create(<Input/>)).toMatchSnapshot();
});

