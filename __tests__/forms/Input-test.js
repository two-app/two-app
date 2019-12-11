// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import Input from "../../src/forms/Input";
import Colors from "../../src/Colors";

test('should maintain snapshot', () => {
    expect(renderer.create(<Input/>)).toMatchSnapshot();
});

const testInput = shallow(<Input/>);

test('should create a TextInput', () => expect(testInput.exists("TextInput")).toBe(true));
test('should have an empty value to start', () => expect(testInput.find("TextInput").prop("value")).toEqual(""));

describe('On Blur', () => {
    const attributes = {placeholder: "Test Placeholder"};
    let isValidFn = jest.fn();
    let onEmitFn = jest.fn();
    let wrapper = shallow(<Input attributes={attributes} isValid={isValidFn} onEmit={onEmitFn}/>);
    let input = wrapper.find("TextInput");

    beforeEach(() => {
        isValidFn = jest.fn();
        onEmitFn = jest.fn();
        wrapper = shallow(<Input attributes={attributes} isValid={isValidFn} onEmit={onEmitFn}/>);
        input = wrapper.find("TextInput");
    });

    const refresh = () => {
        wrapper.update();
        input = wrapper.find("TextInput");
    };

    const setValue = value => {
        input.prop("onChangeText")(value);
        refresh();
    };

    test('maintains the input value', () => {
        expect(input.prop("value")).toEqual("");
        setValue("New Value");
        expect(input.prop("value")).toEqual("New Value");
    });

    test('applies supplied attributes', () => {
        expect(input.prop("placeholder")).toEqual(attributes.placeholder);
    });

    test('checks if input is valid', () => {
        setValue("Test Text");

        input.prop("onBlur")();

        expect(isValidFn).toHaveBeenCalledWith("Test Text");
    });

    test('emits if input is valid', () => {
        setValue("Test Text");
        isValidFn.mockReturnValue(true);

        input.prop("onBlur")();

        expect(onEmitFn).toHaveBeenCalledWith("Test Text");
    });

    test('does not emit if input is invalid', () => {
        setValue("Invalid Input");
        isValidFn.mockReturnValue(false);

        input.prop("onBlur")();

        expect(onEmitFn).not.toHaveBeenCalled();
    });

    test('gets a dark border when focused', () => {
        input.prop("onFocus")();
        refresh();
        expect(input.prop("style")[1]).toHaveProperty("borderBottomColor", Colors.DARK);
    });

    test('gets a salmon border when invalid', () => {
        isValidFn.mockReturnValue(false);
        input.prop("onBlur")();
        refresh();
        expect(input.prop("style")[2]).toHaveProperty("borderBottomColor", Colors.SALMON);
    });
});