import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow, ShallowWrapper} from 'enzyme';
import AcceptSwitch from '../../../src/authentication/register_workflow/AcceptSwitch';
import Colors from '../../../src/Colors';

let tb: AcceptSwitchTestBed;

beforeEach(() => tb = new AcceptSwitchTestBed());

test('should maintain snapshot', () => expect(
    renderer.create(<AcceptSwitch onEmit={tb.onEmitFn}>Some Condition</AcceptSwitch>)
).toMatchSnapshot());

test('should display the condition', () => expect(tb.wrapper.find('Text').render().text()).toEqual('Some Condition'));

test('should emit when the value changes', () => {
    tb.setValueChanged();
    expect(tb.onEmitFn).toHaveBeenCalledWith(true);
});

describe('Switch', () => {
    test('should be false by default', () => expect(tb.getSwitch().prop('value')).toBe(false));

    test('should change to true when clicked', () => {
        tb.setValueChanged();
        expect(tb.wrapper.find('Switch').prop('value')).toBe(true);
    });

    test('should turn the container border green', () => {
        tb.setValueChanged();
        expect(tb.getContainerStyle()).toHaveProperty('borderColor', Colors.VALID_GREEN);
    });
});

describe('Required', () => {
    test('should not be required by default, and have no border', () => {
        expect(tb.getContainerStyle()).not.toHaveProperty('borderColor', Colors.DARK);
    });

    test('should have border if required', () => {
        tb.wrapper.setProps({...tb.wrapper.props(), required: true});

        expect(tb.getContainerStyle()).toHaveProperty('borderColor', Colors.DARK);
    });
});

class AcceptSwitchTestBed {
    onEmitFn = jest.fn();
    wrapper = shallow(<AcceptSwitch onEmit={this.onEmitFn}>Some Condition</AcceptSwitch>);

    getSwitch = (): ShallowWrapper => this.wrapper.find('Switch');

    setValueChanged = () => this.wrapper.find('Switch').prop<(v: boolean) => void>('onValueChange')(true);

    getContainerStyle = () => {
        return this.wrapper.find('View[id=\'container\']').prop('style');
    };
}