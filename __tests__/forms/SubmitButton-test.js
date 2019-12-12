// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import SubmitButton from "../../src/forms/SubmitButton";
import shallow from "enzyme/shallow";

test('should maintain snapshot', () => expect(
    renderer.create(<SubmitButton text={"Submit"} onSubmit={null}/>)
).toMatchSnapshot());

test('should callback onSubmit when pressed', () => {
    const onSubmitFn = jest.fn();

    shallow(<SubmitButton onSubmit={onSubmitFn} text={""}/>)
        .find("TouchableOpacity")
        .prop("onPress")(); // trigger press

    expect(onSubmitFn).toHaveBeenCalled();
});

test('should display given text', () => {
    const displayedText = shallow(<SubmitButton onSubmit={null} text={"Test Submit"}/>)
        .find("Text")
        .render().text();

    expect(displayedText).toEqual("Test Submit");
});