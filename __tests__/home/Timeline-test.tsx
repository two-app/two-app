import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {Text} from 'react-native';
import {Provider} from 'react-redux';

import * as MemoryService from '../../src/memories/MemoryService';
import * as TagService from '../../src/tags/TagService';
import {Timeline} from '../../src/home/Timeline';
import type {Memory} from '../../src/memories/MemoryModels';
import {store} from '../../src/state/reducers';
import type {Tag} from '../../src/tags/Tag';
import {mockNavigation, resetMockNavigation} from '../utils/NavigationMocking';
import type {TimelineType} from '../../src/home/TimelineConstants';
import {uuid} from 'uuidv4';

describe('Timeline', () => {
  let tb: TimelineTestBed;

  beforeEach(() => {
    tb = new TimelineTestBed();
    resetMockNavigation();
  });

  const testTag: Tag = {
    tid: uuid(),
    color: '#1a1a1a',
    memoryCount: 1,
    name: 'Birthday 2021',
  };

  const testMemory: Memory = {
    mid: uuid(),
    title: 'Birthday Cake',
    location: 'London',
    occurredAt: new Date(),
    createdAt: new Date(),
    tag: testTag,
    imageCount: 3,
    videoCount: 5,
    displayContent: undefined,
  };

  describe('By default', () => {
    beforeEach(() => tb.build());

    it('should load the default memory timeline', () => {
      expect(tb.currentTimeline()).toEqual('timeline');
    });

    it('should retrieve the memories', () => {
      expect(tb.getMemoriesFn).toHaveBeenCalledTimes(1);
    });

    it('pressing the title input should navigate to CreateMemoryScreen', () => {
      const btn = tb.render.getByA11yLabel('Create a new memory');
      fireEvent.press(btn);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('NewMemoryScreen');
    });
  });

  describe('Memory Timeline', () => {
    beforeEach(() => {
      tb.onGetMemoriesResolve([testMemory]);
      tb.build();
    });

    it('tapping a memory should navigate to the MemoryScreen', () => {
      const btn = tb.render.getByA11yLabel(`Open memory '${testMemory.title}'`);
      fireEvent.press(btn);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MemoryScreen', {
        mid: testMemory.mid,
      });
    });

    it('tapping the "grouped" icon should swap to the grouped timeline', async () => {
      tb.selectTimeline('grouped');
    });
  });

  describe('Grouped Timeline', () => {
    beforeEach(async () => {
      tb.onGetTagsResolve([testTag]);
      tb.build();
      await tb.selectTimeline('grouped');
      await tb.waitForTimelineToLoad('grouped');
    });

    it('should load the grouped timeline', () => {
      expect(tb.currentTimeline()).toEqual('grouped');
    });

    it('should retrieve the tags', () => {
      expect(tb.getTagsFn).toHaveBeenCalledTimes(1);
    });

    it('should display the tag name', () => {
      // This test will no exist when we implement a UI for the tags
      tb.render.getByA11yLabel(`Open tag '${testTag.name}'`);
    });

    it('tapping the "timeline" icon should swap to the default timeline', async () => {
      tb.selectTimeline('timeline');
    });
  });
});

class TimelineTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  getMemoriesFn = jest.spyOn(MemoryService, 'getMemories').mockClear();
  getTagsFn = jest.spyOn(TagService, 'getTags').mockClear();

  constructor() {
    this.onGetMemoriesResolve([]);
    this.onGetTagsResolve([]);
  }

  onGetMemoriesResolve = (memories: Memory[]) => {
    this.getMemoriesFn.mockResolvedValue(memories);
  };

  onGetTagsResolve = (tags: Tag[]) => {
    this.getTagsFn.mockResolvedValue(tags);
  };

  waitForTimelineToLoad = async (timeline: TimelineType) => {
    await waitFor(() => {
      this.render.getByA11yHint(`Timeline ${timeline} with 1 items`);
    });
  };

  currentTimeline = (): TimelineType => {
    if (this.render.queryByA11yLabel('Selected timeline: timeline')) {
      return 'timeline';
    } else if (this.render.queryByA11yLabel('Selected timeline: grouped')) {
      return 'grouped';
    } else {
      throw Error('Could not determine selected timeline');
    }
  };

  selectTimeline = async (timeline: TimelineType) => {
    const btn = this.render.getByA11yLabel(`Open ${timeline} Timeline`);
    fireEvent.press(btn);
    return await waitFor(() => {
      this.render.getByA11yLabel(`Selected timeline: ${timeline}`);
    });
  };

  build = (): TimelineTestBed => {
    this.render = render(
      <Provider store={store}>
        <Timeline />
      </Provider>,
    );
    return this;
  };
}
