import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import LogoHeader from '../../src/authentication/LogoHeader';

test('should maintain snapshot', () => expect(
    renderer.create(<LogoHeader heading="Test Heading"/>)
).toMatchSnapshot());

test('should display given heading', () => expect(
    shallow(<LogoHeader heading="Test Heading"/>).find('Text[data-testid=\'heading\']').render().text()
).toEqual('Test Heading'));