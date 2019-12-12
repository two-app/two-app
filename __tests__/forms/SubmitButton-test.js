// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import SubmitButton from "../../src/forms/SubmitButton";
import shallow from "enzyme/shallow";

test('should maintain snapshot', () => expect(
    renderer.create(<SubmitButton text={"Submit"} onSubmit={() => console.log("Working")}/>)
).toMatchSnapshot());

test('should callback onSubmit when pressed', () => {
    const onSubmitFn = jest.fn();
    const wrapper = shallow(<SubmitButton onSubmit={onSubmitFn} text={""}/>);
    const clickable = wrapper.find('TouchableOpacity');

    clickable.prop("onPress")();

    expect(onSubmitFn).toHaveBeenCalled();
});

test('should display given text', () => {
    const wrapper = shallow(<SubmitButton onSubmit={null} text={"Test Submit"}/>);
    const displayedText = wrapper.find("Text").render().text();

    expect(displayedText).toEqual("Test Submit");
});