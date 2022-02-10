import {Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render, fireEvent, waitFor} from '@testing-library/react-native';

import {NewTagButton, TagCard} from '../../src/tags/NewTagButton';
import type {Tag} from '../../src/tags/Tag';
import {v4 as uuid} from 'uuid';
import {mockNavigation} from '../utils/NavigationMocking';

describe('NewTagButton', () => {
  let tb: NewTagButtonTestBed;

  beforeEach(() => (tb = new NewTagButtonTestBed().build()));

  describe('tapping the button', () => {
    test('it should navigate to the TagManagementScreen', () => {
      const newTagButton = tb.render.getByText(
        'Optional tag, e.g Anniversary or Birthday...',
      );

      fireEvent.press(newTagButton);

      expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'TagManagementScreen',
        {
          onSubmit: tb.onCreated,
        },
      );
    });
  });
});

class NewTagButtonTestBed {
  onCreated = jest.fn();
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  build = (): NewTagButtonTestBed => {
    this.render = render(<NewTagButton onCreated={this.onCreated} />);
    return this;
  };
}

describe('TagCard', () => {
  let tb: TagCardTestBed;

  beforeEach(() => (tb = new TagCardTestBed().build()));

  describe('tapping the card', () => {
    test('should open the deselect modal', () => {
      tb.pressTag();
      expect(tb.render.getByText(`Deselect ${tb.tag.name} Tag`)).toBeTruthy();
    });
  });

  describe('on the deselect modal', () => {
    test('it should call the deselect function on press', async () => {
      tb.pressTag().pressDeselect();

      await waitFor(() => {
        if (tb.onDeselect.mock.calls.length === 0) {
          throw new Error('Deselect not called yet.');
        }
      });

      expect(tb.onDeselect).toHaveBeenCalledTimes(1);
    });
  });
});

class TagCardTestBed {
  tag: Tag = {name: 'TestTag', tid: uuid(), color: '#1a1a1a', memoryCount: 0};
  onDeselect = jest.fn();
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  build = (): TagCardTestBed => {
    this.render = render(
      <TagCard tag={this.tag} onDeselect={this.onDeselect} />,
    );
    return this;
  };

  pressTag = (): TagCardTestBed => {
    const tagButton = this.render.getByText(this.tag.name);
    fireEvent.press(tagButton);
    return this;
  };

  pressDeselect = (): TagCardTestBed => {
    const deselectButton = this.render.getByText(
      `Deselect ${this.tag.name} Tag`,
    );
    fireEvent.press(deselectButton);
    return this;
  };
}
