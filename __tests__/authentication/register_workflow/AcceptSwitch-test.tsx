import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import type {ShallowWrapper} from 'enzyme';
import {shallow} from 'enzyme';

import AcceptSwitch from '../../../src/authentication/register_workflow/AcceptSwitch';
import Colors from '../../../src/Colors';

let tb: AcceptSwitchTestBed;

beforeEach(() => (tb = new AcceptSwitchTestBed()));

test('should maintain snapshot', () =>
  expect(
    renderer.create(
      <AcceptSwitch accessibilityHint="test hint" onEmit={tb.onEmitFn}>
        Some Condition
      </AcceptSwitch>,
    ),
  ).toMatchSnapshot());

test('should display the condition', () =>
  expect(tb.wrapper.find('Text').render().text()).toEqual('Some Condition'));

test('should emit when the value changes', () => {
  tb.setValueChanged();
  expect(tb.onEmitFn).toHaveBeenCalledWith(true);
});

describe('Switch', () => {
  test('should be false by default', () =>
    expect(tb.getSwitch().prop('value')).toBe(false));

  test('should change to true when clicked', () => {
    tb.setValueChanged();
    expect(tb.wrapper.find('Switch').prop('value')).toBe(true);
  });

  test('should turn the container border green', () => {
    tb.setValueChanged();

    expect(
      tb.doesContainerStyleContain('borderColor', Colors.VALID_GREEN_DARK),
    ).toBe(true);
  });

  test('should set the background to green', () => {
    tb.setValueChanged();
    expect(
      tb.doesContainerStyleContain('backgroundColor', Colors.VALID_GREEN),
    ).toBe(true);
  });
});

describe('Required', () => {
  test('should not be required by default, and have no border', () => {
    expect(tb.doesContainerStyleContain('borderColor', Colors.DARK)).toBe(
      false,
    );
  });

  test('should have border if required', () => {
    tb.wrapper.setProps({...tb.wrapper.props(), required: true});

    expect(tb.doesContainerStyleContain('borderColor', Colors.DARK)).toBe(true);
  });
});

class AcceptSwitchTestBed {
  onEmitFn = jest.fn();
  wrapper = shallow(
    <AcceptSwitch accessibilityHint="test hint" onEmit={this.onEmitFn}>
      Some Condition
    </AcceptSwitch>,
  );

  getSwitch = (): ShallowWrapper => this.wrapper.find('Switch');

  setValueChanged = () =>
    this.wrapper.find('Switch').prop<(v: boolean) => void>('onValueChange')(
      true,
    );

  doesContainerStyleContain = (key: string, value: any): boolean =>
    this.wrapper
      .find("View[data-testid='container']")
      .prop<[any]>('style')
      .filter(f => f !== undefined)
      .some(f => f[key] === value);
}
