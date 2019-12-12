// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import AcceptSwitch from "../../../src/authentication/register_workflow/AcceptSwitch";
import Colors from "../../../src/Colors";

let onEmitFn = jest.fn();
const acceptSwitchJSX = (<AcceptSwitch onEmit={onEmitFn}>Some Condition</AcceptSwitch>);
let wrapper = shallow(acceptSwitchJSX);

beforeEach(() => {
    onEmitFn = jest.fn();
    wrapper = shallow(acceptSwitchJSX);
});

test('should maintain snapshot', () => expect(
    renderer.create(acceptSwitchJSX)
).toMatchSnapshot());

describe('Switch', () => {
    test('should be false by default', () => {
        const switchValue = wrapper.find("Switch").prop("value");
        expect(switchValue).toBe(false);
    });

    test('should change to true when clicked', () => {
        wrapper.find("Switch").prop("onValueChange")(true);
        const switchValue = wrapper.find("Switch").prop("value");
        expect(switchValue).toBe(true);
    });
});

describe('Condition', () => {
    test('should have accepted condition style when switched to true', () => {
        wrapper.find("Switch").prop("onValueChange")(true);

        const textStyles = wrapper.find("Text").prop("style");

        expect(textStyles[1]).toHaveProperty("color", Colors.FADED)
    });
});