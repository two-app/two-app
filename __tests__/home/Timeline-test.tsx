import {
  cleanup,
  fireEvent,
  render,
  RenderAPI,
} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import moment from 'moment';

import * as MemoryService from '../../src/memories/MemoryService';
import * as TagService from '../../src/tags/TagService';
import {Timeline} from '../../src/home/Timeline';
import {Memory} from '../../src/memories/MemoryModels';
import {store} from '../../src/state/reducers';
import {Tag} from '../../src/tags/Tag';
import {mockNavigation, resetMockNavigation} from '../utils/NavigationMocking';

describe('Timeline', () => {
  let tb: TimelineTestBed;

  beforeAll(jest.useRealTimers); // required for the waitFor function to work
  beforeEach(() => {
    tb = new TimelineTestBed();
    resetMockNavigation();
  });
  afterEach(cleanup);

  describe('By default', () => {
    beforeEach(() => tb.build());

    it('should load the default memory timeline', () => {
      tb.render.getByA11yLabel('Selected timeline: timeline');
    });

    it('pressing the title input should navigate to CreateMemoryScreen', () => {
      const btn = tb.render.getByA11yLabel('Create a new memory');
      fireEvent.press(btn);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('NewMemoryScreen');
    });
  });

  describe('Memory Timeline', () => {
    const testMemory: Memory = {
      id: 5,
      title: 'Birthday',
      location: 'Birthday Location',
      date: moment().valueOf(),
      tag: undefined,
      imageCount: 3,
      videoCount: 5,
      displayContent: undefined,
    };

    beforeEach(() => {
      tb.onGetMemoriesResolve([testMemory]);
      tb.build();
    });

    it('tapping a memory should navigate to the MemoryScreen', () => {
      const btn = tb.render.getByA11yLabel(`Open memory '${testMemory.title}'`);
      fireEvent.press(btn);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MemoryScreen', {
        mid: testMemory.id,
      });
    });
  });
});

class TimelineTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  getMemoriesFn = jest.spyOn(MemoryService, 'getMemories');
  getTagsFn = jest.spyOn(TagService, 'getTags');

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

  build = (): TimelineTestBed => {
    this.render = render(
      <Provider store={store}>
        <SafeAreaProvider
          initialSafeAreaInsets={{top: 1, left: 2, right: 3, bottom: 4}}>
          <Timeline />
        </SafeAreaProvider>
      </Provider>,
    );
    return this;
  };
}
