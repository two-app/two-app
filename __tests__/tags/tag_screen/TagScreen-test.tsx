import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {Alert, Text} from 'react-native';

import type {Tag} from '../../../src/tags/Tag';
import {TagScreen} from '../../../src/tags/tag_screen/TagScreen';
import * as TagService from '../../../src/tags/TagService';
import {v4 as uuid} from 'uuid';
import {mockNavigation} from '../../utils/NavigationMocking';
import {useTagStore} from '../../../src/tags/TagStore';

describe('TagScreen', () => {
  let tb: TagScreenTestBed;

  const names = ['Birthday', 'Anniversary', 'Holiday'];
  const tags: Tag[] = names.map((name, index) => ({
    name,
    color: '#1985a1',
    tid: uuid(),
    memoryCount: index + 2, // to make it interesting
  }));

  beforeEach(() => (tb = new TagScreenTestBed()));

  describe('On creation', () => {
    it('should request all tags', () => {
      expect(tb.build().getTagsFn).toHaveBeenCalledTimes(1);
    });

    it('should display retrieval errors', async () => {
      tb.onGetTagsReject();
      tb.build();
      await waitFor(() =>
        tb.render.getByText('Sorry, we were unable to load your tags.', {
          exact: false,
        }),
      );
    });

    it('should display the resolved tag names', async () => {
      tb.onGetTagsResolve(tags);
      tb.build();

      await waitFor(() =>
        tb.render.getAllByA11yLabel('A tag owned by the couple'),
      );

      for (const name of names) {
        tb.render.getByText(name);
      }
    });

    test('it should store them in the tag store', async () => {
      tb.onGetTagsResolve(tags);
      tb.build();

      await waitFor(() =>
        tb.render.getAllByA11yLabel('A tag owned by the couple'),
      );

      expect(useTagStore.getState().all).toEqual(tags);
    });
  });

  describe('Clicking the tag input button', () => {
    it('should navigate to the TagManagementScreen', () => {
      tb.build().pressCreateTagButton();
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'TagManagementScreen',
        {
          onSubmit: expect.anything(),
        },
      );
    });
  });

  describe('Tag Management', () => {
    beforeEach(() => {
      tb.onGetTagsResolve(tags);
      tb.build();
    });

    describe('Clicking a tags edit button', () => {
      it('should navigate to the TagManagementScreen', () => {
        tb.pressEditTagButton(tags[1].name);
        expect(mockNavigation.navigate).toHaveBeenCalledWith(
          'TagManagementScreen',
          {
            initialTag: tags[1],
            onSubmit: expect.anything(),
          },
        );
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

  constructor() {
    this.getTagsFn = jest.spyOn(TagService, 'getTags').mockClear();
    this.alertFn = jest.spyOn(Alert, 'alert');
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
    this.render = render(<TagScreen />);
    return this;
  };
}
