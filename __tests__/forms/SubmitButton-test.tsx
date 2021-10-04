import {SubmitButton} from '../../src/forms/SubmitButton';
import {fireEvent, render, RenderAPI} from '@testing-library/react-native';
import {Text} from 'react-native';

describe('SubmitButton', () => {
  let tb: SubmitButtonTestBed;

  beforeEach(() => (tb = new SubmitButtonTestBed().build()));

  test('it should fire the submit event on press', () => {
    tb.pressSubmit();

    expect(tb.onSubmit).toHaveBeenCalledTimes(1);
  });

  test('it should display the given text', () => {
    expect(tb.render.getByText(tb.submitText)).toBeTruthy();
  });

  describe('disabled button', () => {
    test('it should not fire an event when pressed', () => {
      tb.disabled = true;
      tb.build();

      tb.pressSubmit();

      expect(tb.onSubmit).not.toHaveBeenCalled();
    });
  });
});

class SubmitButtonTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);
  onSubmit = jest.fn();
  submitText = 'Test Submit';
  disabled = false;

  constructor() {}

  //  elements
  button = () => this.render.getByA11yLabel('Test Submit Label');

  // events
  pressSubmit = () => fireEvent.press(this.button());

  build = (): SubmitButtonTestBed => {
    this.render = render(
      <SubmitButton
        onSubmit={this.onSubmit}
        text={this.submitText}
        disabled={this.disabled}
        accessibilityHint="Test Submit Hint"
        accessibilityLabel="Test Submit Label"
      />,
    );
    return this;
  };
}
