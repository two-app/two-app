// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {HomeScreen} from "../../src/home/HomeScreen";
import {User} from "../../src/authentication/UserModel";

describe('HomeScreen', () => {
    const user = new User(1, 2, 3);

    test('should maintain snapshot', () => expect(renderer.create(<HomeScreen user={user}/>)).toMatchSnapshot());
});
