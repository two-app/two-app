// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import SubmitButton from "../../src/forms/SubmitButton";
import LogoHeader from "../../src/authentication/LogoHeader";

test('should maintain snapshot', () => expect(
    renderer.create(<LogoHeader heading="Test Heading"/>)
).toMatchSnapshot());

test('should display given heading', () => {
    const wrapper = shallow(<LogoHeader heading="Test Heading"/>);
    const textElement = wrapper.find("Text[id='heading']");

    const writtenHeading = textElement.render().text();
    expect(writtenHeading).toEqual("Test Heading");
});