import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {Alert, Text} from 'react-native';
import {Provider} from 'react-redux';

import type {Tag} from '../../../src/tags/Tag';
import TagScreen from '../../../src/tags/tag_screen/TagScreen';
import * as TagService from '../../../src/tags/TagService';
import * as RootNavigation from '../../../src/navigation/RootNavigation';
import {store} from '../../../src/state/reducers';

describe('TagScreen', () => {
  let tb: TagScreenTestBed;

  beforeEach(() => (tb = new TagScreenTestBed()));

  describe('On creation', () => {
    it('should request all tags', () => {
      expect(tb.build().getTagsFn).toHaveBeenCalledTimes(1);
    });

    it('should display retrieval errors', async () => {
      tb.onGetTagsReject();
      tb.build();
      await waitFor(() =>
        tb.render.getByText(
          'Sorry, we were unable to load your tags.\nPlease try again soon.',
        ),
      );
    });

    it('should display the resolved tag names', async () => {
      const names = ['Anniversary', 'Birthday', 'Wedding'];
      const tags: Tag[] = names.map((name, tid) => ({
        name,
        color: '#1a1a1a',
        tid,
        memoryCount: 0,
      }));
      tb.onGetTagsResolve(tags);

      tb.build();
      await waitFor(() =>
        tb.render.getAllByA11yLabel('A tag owned by the couple'),
      );

      for (const name of names) {
        tb.render.getByText(name);
      }
    });
  });

  describe('Clicking the tag input button', () => {
    it('should navigate to the TagManagementScreen', () => {
      tb.build().pressCreateTagButton();
      expect(tb.navigateFn).toHaveBeenCalledWith('TagManagementScreen', {
        onSubmit: expect.anything(),
      });
    });
  });

  describe('Tag Management', () => {
    const names = ['Birthday', 'Anniversary', 'Holiday'];
    const tags: Tag[] = names.map((name, tid) => ({
      name,
      color: '#1985a1',
      tid,
      memoryCount: tid + 2, // to make it interesting
    }));

    beforeEach(() => {
      tb.onGetTagsResolve(tags);
      tb.build();
    });

    describe('Clicking a tags edit button', () => {
      it('should navigate to the TagManagementScreen', () => {
        tb.pressEditTagButton(tags[1].name);
        expect(tb.navigateFn).toHaveBeenCalledWith('TagManagementScreen', {
          initialTag: tags[1],
          onSubmit: expect.anything(),
        });
      });
    });

    describe('Clicking a tags delete button', () => {
      it('should show an alert', () => {
        tb.pressDeleteTagButton(tags[1].name);
        expect(tb.alertFn).toHaveBeenCalledWith(
          'Delete Tag',
          `Deleting '${tags[1].name}' will remove it from ${tags[1].memoryCount} memories`,
          expect.anything(),
        );
      });
    });
  });
});

class TagScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  getTagsFn: jest.SpyInstance<Promise<Tag[]>, []>;
  alertFn: jest.SpyInstance;
  navigateFn: jest.Mock;

  constructor() {
    this.getTagsFn = jest.spyOn(TagService, 'getTags').mockClear();
    this.alertFn = jest.spyOn(Alert, 'alert');
    this.navigateFn = jest.fn();

    jest // spy on getNavigation custom hook
      .spyOn(RootNavigation, 'getNavigation')
      .mockReturnValue({navigate: this.navigateFn} as any);

    this.onGetTagsResolve([]);
  }

  onGetTagsResolve = (tags: Tag[]) => {
    this.getTagsFn.mockResolvedValue(tags);
  };

  onGetTagsReject = () => {
    this.getTagsFn.mockRejectedValue({reason: 'some reason'});
  };

  pressCreateTagButton = () => {
    const btn = this.render.getByA11yLabel('Tap to create a new tag');
    fireEvent.press(btn);
  };

  pressEditTagButton = (name: string) => {
    const btn = this.render.getByA11yHint(`Edit Tag '${name}'`);
    fireEvent.press(btn);
  };

  pressDeleteTagButton = (name: string) => {
    const btn = this.render.getByA11yHint(`Delete Tag '${name}'`);
    fireEvent.press(btn);
  };

  build = (): TagScreenTestBed => {
    this.render = render(
      <Provider store={store}>
        <TagScreen navigation={{navigate: this.navigateFn} as any} />
      </Provider>,
    );
    return this;
  };
}
