// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import Input from "../../src/forms/Input";
import Colors from "../../src/Colors";


describe('Input', () => {

    let tb;
    beforeEach(() => tb = new TestBed());
    
    test('should maintain snapshot', () => {
        expect(renderer.create(<Input/>)).toMatchSnapshot();
    });

    test('starts with an empty value', () => expect(tb.input.prop("value")).toEqual(""));

    test('applies supplied attributes', () => expect(tb.input.prop("placeholder")).toEqual(tb.attributes.placeholder));

    test('maintains the input value', () => {
        expect(tb.getInputValue()).toEqual("");
        tb.setInputValue("New Value");
        expect(tb.getInputValue()).toEqual("New Value");
    });
});

describe('On Blur', () => {
    let tb;
    beforeEach(() => tb = new TestBed());

    test('checks if input is valid', () => {
        tb.blurInput("Test Text");
        expect(tb.isValidFn).toHaveBeenCalledWith("Test Text");
    });

    test('emits if input is valid', () => {
        tb.isValidFn.mockReturnValue(true);
        tb.blurInput("Test Text");
        expect(tb.onEmitFn).toHaveBeenCalledWith("Test Text");
    });

    test('does not emit if input is invalid', () => {
        tb.isValidFn.mockReturnValue(false);
        tb.blurInput("Invalid Input");
        expect(tb.onEmitFn).not.toHaveBeenCalled();
    });

    test('gets a dark border when focused', () => {
        tb.input.prop("onFocus")();
        tb.refresh();
        expect(tb.input.prop("style")[1]).toHaveProperty("borderBottomColor", Colors.DARK);
    });

    test('gets a salmon border when invalid', () => {
        tb.isValidFn.mockReturnValue(false);
        tb.input.prop("onBlur")();
        tb.refresh();
        expect(tb.input.prop("style")[2]).toHaveProperty("borderBottomColor", Colors.SALMON);
    });
});

class TestBed {
    constructor() {
        this.attributes = {placeholder: "Test Placeholder"};
        this.isValidFn = jest.fn();
        this.onEmitFn = jest.fn();
        this.wrapper = shallow(<Input attributes={this.attributes} isValid={this.isValidFn} onEmit={this.onEmitFn}/>);
        this.input = this.wrapper.find("TextInput");
    }

    refresh = () => {
        this.wrapper.update();
        this.input = this.wrapper.find("TextInput");
    };

    setInputValue = value => {
        this.input.prop("onChangeText")(value);
        this.refresh();
    };

    blurInput = value => {
        this.setInputValue(value);
        this.input.prop("onBlur")();
        this.refresh();
    };

    getInputValue = () => this.input.prop("value");
}