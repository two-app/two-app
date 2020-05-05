import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import SubmitButton from "../../src/forms/SubmitButton";
import { shallow } from "enzyme";
import { ShallowWrapper } from "enzyme";

describe('SubmitButton', () => {
    test('should maintain snapshot', () => expect(
        renderer.create(<SubmitButton text={"Submit"} onSubmit={() => null} />)
    ).toMatchSnapshot());

    let onSubmitFn: jest.Mock;
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        onSubmitFn = jest.fn();
        wrapper = shallow(<SubmitButton onSubmit={onSubmitFn} text="Test Submit" />);
    });

    test('should callback onSubmit when pressed', () => {
        wrapper.find("EnabledSubmitButton").prop<() => void>("onSubmit")();
        expect(onSubmitFn).toHaveBeenCalled();
    });

    test('should display given text', () => expect(
        wrapper.find("EnabledSubmitButton").shallow().prop("text")
    ).toEqual("Test Submit"));

    test('with disabled set to true it should render a disabled button', () => {
        const wrapper = shallow(<SubmitButton onSubmit={onSubmitFn} text='text' disabled={true} />);
        expect(wrapper.exists("DisabledSubmitButton")).toBe(true);
    });

    test('should not be disabled by default', () => expect(
        wrapper.exists("EnabledSubmitButton")
    ).toBe(true));
});
