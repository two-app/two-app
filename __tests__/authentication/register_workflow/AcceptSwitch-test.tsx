import AcceptSwitch from '../../../src/authentication/register_workflow/AcceptSwitch';
import {fireEvent, render, RenderAPI} from '@testing-library/react-native';
import {Text} from 'react-native';

describe('AcceptSwitch', () => {
  let tb: AcceptSwitchTestBed;

  beforeEach(() => (tb = new AcceptSwitchTestBed().build()));

  test('it should display the condition', () => {
    expect(tb.render.getByText('Some Condition')).toBeTruthy();
  });

  test('should be unchecked by default', () => {
    expect(tb.isSwitchEnabled()).toEqual(false);
  });

  test('should emit its status when pressed', () => {
    tb.pressSwitch();

    expect(tb.onEmit).toHaveBeenCalledWith(true);
  });

  test('should become checked when pressed', () => {
    tb.pressSwitch();

    expect(tb.isSwitchEnabled()).toEqual(true);
  });

  test('should be a required field', () => {
    expect(tb.isSwitchRequired()).toEqual(true);
  });

  test('should be optional without the required flag', () => {
    tb.setRequired(false);
    tb.build();

    expect(tb.isSwitchRequired()).toEqual(false);
  });
});

class AcceptSwitchTestBed {
  isRequired: boolean = true;

  render: RenderAPI = render(<Text>Not Implemented</Text>);

  setRequired = (isRequired: boolean) => {
    this.isRequired = isRequired;
  };

  // elements
  switchButton = () => this.render.getByA11yLabel('Test Switch Hint');

  // queries
  isSwitchRequired = () =>
    this.switchButton().props.accessibilityHint === 'Acceptance is required.';
  isSwitchEnabled = () =>
    this.switchButton().props.accessibilityState.checked === true;

  // events
  pressSwitch = () => fireEvent(this.switchButton(), 'onValueChange', true);

  // mocks
  onEmit = jest.fn();

  build = (): AcceptSwitchTestBed => {
    this.render = render(
      <AcceptSwitch
        accessibilityLabel="Test Switch Hint"
        onEmit={this.onEmit}
        required={this.isRequired}>
        <Text>Some Condition</Text>
      </AcceptSwitch>,
    );
    return this;
  };
}
