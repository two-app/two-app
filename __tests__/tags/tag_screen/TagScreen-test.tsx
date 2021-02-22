import {
  cleanup,
  fireEvent,
  render,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Tag} from '../../../src/tags/Tag';
import {TagScreen} from '../../../src/tags/tag_screen/TagScreen';
import * as TagService from '../../../src/tags/TagService';
import * as RootNavigation from '../../../src/navigation/RootNavigation';

describe('TagScreen', () => {
  let tb: TagScreenTestBed;

  beforeEach(() => (tb = new TagScreenTestBed()));
  afterEach(cleanup);
  beforeAll(jest.useRealTimers); // required for the waitFor function to work

  describe('On creation', () => {
    it('should request all tags', () => {
      expect(tb.build().getTagsFn).toHaveBeenCalledTimes(1);
    });

    it('should display a loading screen', () => {
      tb.onGetTagsWait();
      tb.build();
      tb.render.getByText('Loading your tags...');
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
    it('should navigate to the NewTagScreen', () => {
      tb.build().pressCreateTagButton();
      expect(tb.navigateFn).toHaveBeenCalled();
    });
  });
});

class TagScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  getTagsFn: jest.SpyInstance<Promise<Tag[]>, []>;
  navigateFn: jest.Mock;

  constructor() {
    this.getTagsFn = jest.spyOn(TagService, 'getTags').mockClear();
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
    this.getTagsFn.mockRejectedValue({});
  };

  onGetTagsWait = () => {
    this.getTagsFn.mockReturnValue(new Promise(() => null));
  };

  pressCreateTagButton = () => {
    const btn = this.render.getByA11yLabel('Tap to create a new tag');
    fireEvent.press(btn);
  };

  build = (): TagScreenTestBed => {
    this.render = render(
      <SafeAreaProvider
        initialSafeAreaInsets={{top: 1, left: 2, right: 3, bottom: 4}}>
        <TagScreen navigation={{navigate: this.navigateFn} as any} />
      </SafeAreaProvider>,
    );
    return this;
  };
}
