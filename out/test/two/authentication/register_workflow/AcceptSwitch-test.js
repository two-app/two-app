// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow, ShallowWrapper} from "enzyme";
import AcceptSwitch from "../../../src/authentication/register_workflow/AcceptSwitch";
import Colors from "../../../src/Colors";

let tb: AcceptSwitchTestBed;

beforeEach(() => tb = new AcceptSwitchTestBed());

test('should maintain snapshot', () => expect(
    renderer.create(<AcceptSwitch onEmit={tb.onEmitFn}>Some Condition</AcceptSwitch>)
).toMatchSnapshot());

test('should display the condition', () => expect(tb.wrapper.find("Text").render().text()).toEqual("Some Condition"));

test('should emit when the value changes', () => {
    tb.getSwitch().prop("onValueChange")(true);
    expect(tb.onEmitFn).toHaveBeenCalledWith(true);
});

describe('Switch', () => {
    test('should be false by default', () => expect(tb.getSwitch().prop("value")).toBe(false));

    test('should change to true when clicked', () => {
        tb.getSwitch().prop("onValueChange")(true);
        expect(tb.wrapper.find("Switch").prop("value")).toBe(true);
    });

    test('should turn the container border green', () => {
        tb.getSwitch().prop("onValueChange")(true);
        expect(
            tb.wrapper.find("View[id='container']").prop("style")
                .filter(s => s != null)
                .filter(s => s.borderColor === Colors.VALID_GREEN)
                .length > 0
        ).toBe(true);
    });
});

describe('Required', () => {
    test('should not be required by default, and have no border', () => expect(
        tb.wrapper.find("View[id='container']").prop("style")
            .filter(s => s != null)
            .filter(s => s.borderColor === Colors.DARK)
            .length > 0
    ).toBe(false));

    test('should have border if required', () => {
        tb.wrapper.setProps({...tb.wrapper.props(), required: true});

        const hasRequiredBorder = tb.wrapper.find("View[id='container']")
            .prop("style")
            .filter(s => s != null)
            .filter(s => s.borderColor === Colors.DARK)
            .length > 0;

        expect(hasRequiredBorder).toBe(true);
    });
});

class AcceptSwitchTestBed {
    onEmitFn = jest.fn();
    wrapper = shallow(<AcceptSwitch onEmit={this.onEmitFn}>Some Condition</AcceptSwitch>);

    getSwitch: ShallowWrapper = () => this.wrapper.find("Switch");
}