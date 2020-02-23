import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import SubmitButton from "../../src/forms/SubmitButton";
import {shallow} from "enzyme";
import {ShallowWrapper} from "enzyme";

test('should maintain snapshot', () => expect(
    renderer.create(<SubmitButton text={"Submit"} onSubmit={() => null}/>)
).toMatchSnapshot());

let onSubmitFn: jest.Mock;
let wrapper: ShallowWrapper;

beforeEach(() => {
    onSubmitFn = jest.fn();
    wrapper = shallow(<SubmitButton onSubmit={onSubmitFn} text="Test Submit"/>);
});

test('should callback onSubmit when pressed', () => {
    wrapper.find("TouchableOpacity").prop<() => void>("onPress")();
    expect(onSubmitFn).toHaveBeenCalled();
});

test('should display given text', () => expect(
    wrapper.find("Text").render().text()
).toEqual("Test Submit"));

test('should not be disabled by default', () => expect(
    wrapper.find("TouchableOpacity").prop("disabled")
).toBe(false));