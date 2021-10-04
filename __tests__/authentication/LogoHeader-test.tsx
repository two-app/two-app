import {LogoHeader} from '../../src/authentication/LogoHeader';
import {render, RenderAPI} from '@testing-library/react-native';
import {Text} from 'react-native';

describe('LogoHeader', () => {
  let tb: LogoHeaderTestBed;

  beforeEach(() => {
    tb = new LogoHeaderTestBed().build();
  });

  test('it should display the passed heading', () => {
    expect(tb.render.getByText(tb.heading)).toBeTruthy();
  });
});

class LogoHeaderTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  heading: string = 'Some Test Heading';

  build = (): LogoHeaderTestBed => {
    this.render = render(<LogoHeader heading={this.heading} />);
    return this;
  };
}
