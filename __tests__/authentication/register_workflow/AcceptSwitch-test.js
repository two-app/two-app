// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import AcceptSwitch from "../../../src/authentication/register_workflow/AcceptSwitch";
import Colors from "../../../src/Colors";

let onEmitFn = jest.fn();
let wrapper = shallow(<AcceptSwitch onEmit={onEmitFn}>Some Condition</AcceptSwitch>);

beforeEach(() => {
    onEmitFn = jest.fn();
    wrapper = shallow(<AcceptSwitch onEmit={onEmitFn}>Some Condition</AcceptSwitch>);
});

test('should maintain snapshot', () => expect(
    renderer.create(<AcceptSwitch onEmit={onEmitFn}>Some Condition</AcceptSwitch>)
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

    test('should turn the container border green', () => {
        wrapper.find("Switch").prop("onValueChange")(true);

        const hasAcceptedBorder = wrapper.find("View[id='container']")
            .prop("style")
            .filter(s => s != null)
            .filter(s => s.borderColor === Colors.VALID_GREEN)
            .length > 0;

        expect(hasAcceptedBorder).toBe(true);
    });
});

describe('Condition', () => {
    test('should display the condition', () => {
        expect(wrapper.find("Text").render().text()).toEqual("Some Condition");
    });
});

describe('Required', () => {
    test('should not be required by default, and have no border', () => {
        const hasRequiredBorder = wrapper.find("View[id='container']")
            .prop("style")
            .filter(s => s != null)
            .filter(s => s.borderColor === Colors.DARK)
            .length > 0;

        expect(hasRequiredBorder).toBe(false);
    });

    test('should have border if required', () => {
        wrapper.setProps({...wrapper.props(), required: true});

        const hasRequiredBorder = wrapper.find("View[id='container']")
            .prop("style")
            .filter(s => s != null)
            .filter(s => s.borderColor === Colors.DARK)
            .length > 0;

        expect(hasRequiredBorder).toBe(true);
    });
});

describe('On Emit', () => {
    test('should emit when the value changes', () => {
        wrapper.find("Switch").prop("onValueChange")(true);
        expect(onEmitFn).toHaveBeenCalledWith(true);
    });
});