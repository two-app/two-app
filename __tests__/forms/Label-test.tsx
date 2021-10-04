import {Label} from '../../src/forms/Label';
import {render, RenderAPI} from '@testing-library/react-native';
import {Text} from 'react-native';

describe('Label', () => {
  let tb: LabelTestBed;
  beforeEach(() => (tb = new LabelTestBed().build()));

  test('it should display the given text', () => {
    expect(tb.render.getByText(tb.labelText)).toBeTruthy();
  });
});

class LabelTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  labelText: string = 'Some Label Text';

  build = (): LabelTestBed => {
    this.render = render(<Label text={this.labelText} />);
    return this;
  };
}
