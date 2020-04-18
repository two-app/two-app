import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow, ShallowWrapper} from 'enzyme';
import Input from '../../src/forms/Input';
import Colors from '../../src/Colors';


describe('Input', () => {
    let tb: InputTestBed;
    beforeEach(() => {
        tb = new InputTestBed();
    });

    test('should maintain snapshot', () => expect(renderer.create(<Input/>)).toMatchSnapshot());

    test('starts with an empty value', () => expect(tb.input.prop('value')).toEqual(''));

    test('applies supplied attributes', () => expect(tb.input.prop('placeholder')).toEqual(tb.attributes.placeholder));

    test('maintains the input value', () => {
        expect(tb.getInputValue()).toEqual('');
        tb.setInputValue('New Value');
        expect(tb.getInputValue()).toEqual('New Value');
    });
});

describe('On Change', () => {
    test('emits to onChangeFn', () => {
        const tb = new InputTestBed();

        tb.setInputValue('testVal');

        expect(tb.onChangeFn).toHaveBeenCalledWith('testVal');
    });
});

describe('On Blur', () => {
    let tb: InputTestBed;
    beforeEach(() => tb = new InputTestBed());

    test('checks if input is valid', () => {
        tb.blurInput('Test Text');
        expect(tb.isValidFn).toHaveBeenCalledWith('Test Text');
    });

    test('gets a dark border when focused', () => {
        tb.input.prop<() => void>('onFocus')();
        tb.refresh();
        expect(tb.input.prop<any>('style')[1]).toHaveProperty('borderBottomColor', Colors.DARK);
    });

    test('gets a salmon border when invalid', () => {
        tb.isValidFn.mockReturnValue(false);
        tb.blurInput('');
        expect(tb.input.prop<any>('style')[2]).toHaveProperty('borderBottomColor', Colors.SALMON);
    });
});

describe('With label', () => {
    test('creates the label', () => expect(new InputTestBed('lbl').wrapper.exists('Label')).toBe(true));

    test('passes label text in', () => {
        expect(new InputTestBed('lbl').wrapper.find('Label').prop('text')).toEqual('lbl');
    });

    test('does not create a label if none provided', () => {
        expect(new InputTestBed().wrapper.exists('Label')).toBe(false);
    });
});

class InputTestBed {

    attributes = {placeholder: 'Test Placeholder'};
    isValidFn = jest.fn();
    onChangeFn = jest.fn();
    wrapper: ShallowWrapper;
    input: ShallowWrapper;

    constructor(label?: string) {
        this.wrapper = shallow(
            <Input attributes={this.attributes} isValid={this.isValidFn} onChange={this.onChangeFn} label={label}/>
        );

        console.log(this.wrapper.debug())

        this.input = this.wrapper.find('TextInput');
    }

    refresh = () => {
        this.wrapper.update();
        this.input = this.wrapper.find('TextInput');
    };

    setInputValue = (value: string) => {
        this.input.prop<(v: string) => void>('onChangeText')(value);
        this.refresh();
    };

    blurInput = (value: string) => {
        this.setInputValue(value);
        this.input.prop<() => void>('onBlur')();
        this.refresh();
    };

    getInputValue = () => this.input.prop('value');
}