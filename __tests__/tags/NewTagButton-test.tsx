import {Text} from 'react-native';
import React from 'react';
import {
  render,
  RenderAPI,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react-native';

import {NewTagButton, TagCard} from '../../src/tags/NewTagButton';
import {Tag} from '../../src/tags/Tag';
import {navigateFn} from '../../src/navigation/__mocks__/RootNavigation';

describe('NewTagButton', () => {
  let tb: NewTagButtonTestBed;

  beforeEach(() => (tb = new NewTagButtonTestBed().build()));
  afterEach(cleanup);

  describe('tapping the button', () => {
    test('it should navigate to the TagManagementScreen', () => {
      const newTagButton = tb.render.getByText(
        'Optional tag, e.g Anniversary or Birthday...',
      );

      fireEvent.press(newTagButton);

      expect(navigateFn).toHaveBeenCalledTimes(1);
      expect(navigateFn).toHaveBeenCalledWith('TagManagementScreen', {
        onSubmit: tb.onCreated,
      });
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

  // required for the waitFor function to work
  beforeAll(jest.useRealTimers);
  afterAll(() => jest.useFakeTimers());

  beforeEach(() => (tb = new TagCardTestBed().build()));
  afterEach(cleanup);

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
  tag: Tag = {name: 'TestTag', tid: 5, color: '#1a1a1a', memoryCount: 0};
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
