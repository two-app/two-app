import {Input} from '../../src/forms/Input';
import {fireEvent, render, RenderAPI} from '@testing-library/react-native';
import {Text} from 'react-native';

describe('Input', () => {
  let tb: InputTestBed;
  beforeEach(() => {
    tb = new InputTestBed().build();
  });

  test('starts with an empty value', () => {
    expect(tb.getInputValue()).toEqual('');
  });

  test('applies supplied attributes', () => {
    expect(tb.input().props.placeholder).toEqual(tb.attributes.placeholder);
  });

  test('maintains the input value', () => {
    expect(tb.getInputValue()).toEqual('');

    tb.setInputValue('New Value');

    expect(tb.getInputValue()).toEqual('New Value');
  });

  test('emits the changed value', () => {
    tb.setInputValue('New Value');

    expect(tb.onChange).toHaveBeenCalledWith('New Value');
  });

  test('checks if input is valid', () => {
    tb.isValid = jest.fn().mockReturnValue(true);
    tb.build();

    tb.setInputValue('New Value');

    expect(tb.isValid).toHaveBeenCalledWith('New Value');
    expect(tb.input().props.accessibilityValue.text).toEqual('Valid entry');
  });

  test('becomes invalid if the valid function returns false', () => {
    tb.isValid = () => false;
    tb.build();

    tb.setInputValue('New Value');

    expect(tb.input().props.accessibilityValue.text).toEqual('Invalid entry');
  });
});

class InputTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  attributes = {placeholder: 'Test Placeholder'};
  isValid: () => boolean = () => true;
  onChange = jest.fn();
  inputLabel = 'Test Input Label';

  // elements
  input = () => this.render.getByA11yLabel('Test Input');

  // queries
  getInputValue = (): string => this.input().props.value;

  // events
  setInputValue = (text: string) => {
    fireEvent.changeText(this.input(), text);
    fireEvent(this.input(), 'blur');
  };

  build = (): InputTestBed => {
    this.render = render(
      <Input
        attributes={this.attributes}
        isValid={this.isValid}
        onChange={this.onChange}
        label={this.inputLabel}
        accessibilityLabel="Test Input"
      />,
    );
    return this;
  };
}
