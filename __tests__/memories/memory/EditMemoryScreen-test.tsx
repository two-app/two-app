import {Text} from 'react-native';
import React from 'react';
import {
  render,
  RenderAPI,
  fireEvent,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
  QueryReturn,
} from 'react-native-testing-library';
import moment from 'moment';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ReactTestInstance} from 'react-test-renderer';

import {EditMemoryScreen} from '../../../src/memories/memory/EditMemoryScreen';
import {Memory, MemoryPatch} from '../../../src/memories/MemoryModels';
import * as TagService from '../../../src/tags/TagService';
import {Tag} from '../../../src/tags/Tag';
import * as MemoryService from '../../../src/memories/MemoryService';
import {ErrorResponse} from '../../../src/http/Response';
import {updateMemory} from '../../../src/memories/store';

describe('EditMemoryScreen', () => {
  let tb: EditMemoryScreenTestBed;

  beforeEach(() => (tb = new EditMemoryScreenTestBed().build()));
  afterEach(cleanup);
  beforeAll(jest.useRealTimers); // required for the waitFor function to work

  test('the submit button should be disabled by default', () => {
    const submit = tb.render.getByA11yLabel('Update Memory');
    expect(submit.props.accessibilityState).toEqual({disabled: true});
  });

  describe('Modifying the Title', () => {
    test('it should enable the submit button', () => {
      tb.setTitleInput('New Title');

      expect(tb.isSubmitButtonEnabled()).toEqual(true);
    });

    test('it should disable the submit button for length 0', () => {
      tb.setTitleInput('');
      expect(tb.isSubmitButtonEnabled()).toEqual(false);
    });
  });

  describe('Modifying the Location', () => {
    test('it should enable the submit button', () => {
      tb.setLocationInput('New Location');
      expect(tb.isSubmitButtonEnabled()).toBe(true);
    });

    it('it should disable the submit button for length 0', () => {
      tb.setLocationInput('');
      expect(tb.isSubmitButtonEnabled()).toBe(false);
    });
  });

  describe('Modifying the Tag', () => {
    test('removing the tag should enable the submit button', () => {
      tb.selectTag(tb.selectedTag.name); // deselect tag
      expect(tb.isSubmitButtonEnabled()).toBe(true);
    });

    test('changing the tag should enable the submit button', () => {
      tb.selectTag(tb.otherTag.name); // select other tag
      expect(tb.isSubmitButtonEnabled()).toBe(true);
    });

    test('removing and readding the tag should disable the button', () => {
      tb.selectTag(tb.selectedTag.name); // deselect
      tb.selectTag(tb.selectedTag.name); // reselect
      expect(tb.isSubmitButtonEnabled()).toBe(false);
    });

    test('submitting a deselected tag should pass value -1 for tag id', () => {
      tb.selectTag(tb.selectedTag.name); // deselect tag

      tb.pressSubmitButton();

      expect(tb.patchMemoryFn).toHaveBeenCalledTimes(1);
      expect(tb.patchMemoryFn).toHaveBeenCalledWith(tb.memory.id, {
        tagId: -1,
      });
    });
  });

  describe('Submitting an Edit', () => {
    beforeEach(() => {
      tb.setTitleInput('New Title');
      tb.setLocationInput('New Location');
      tb.selectTag(tb.otherTag.name);
    });

    test('it should calculate the correct patch', () => {
      tb.pressSubmitButton();

      expect(tb.patchMemoryFn).toHaveBeenCalledTimes(1);
      expect(tb.patchMemoryFn).toHaveBeenCalledWith(tb.memory.id, {
        title: 'New Title',
        location: 'New Location',
        tagId: tb.otherTag.tid,
      });
    });

    test('it should show a loading indicator', () => {
      tb.patchMemoryFn.mockReturnValue(new Promise(() => {}));
      tb.pressSubmitButton();

      expect(tb.getLoadingScreen()).toBeTruthy();
    });

    test('it should navigate to the previous screen', async () => {
      tb.pressSubmitButton();

      await waitFor(() => {
        if (tb.goBackFn.mock.calls.length === 0) {
          throw new Error('Zero calls');
        }
      });

      expect(tb.goBackFn).toHaveBeenCalledTimes(1);
    });

    test('it should hide the loading indicator when complete', async () => {
      tb.pressSubmitButton();

      await waitForElementToBeRemoved(() => tb.queryLoadingScreen());

      expect(tb.queryLoadingScreen()).toBeFalsy();
    });

    test('it should display an error for a rejected patch', async () => {
      const e: ErrorResponse = {
        status: 'Bad Request',
        code: 400,
        reason: 'Something went wrong.',
      };

      tb.onPatchError(e);
      tb.pressSubmitButton();
      await waitFor(() => tb.render.getByText(e.reason));

      expect(tb.render.getByText(e.reason)).toBeTruthy();

      const a11yError = tb.render.getByA11yHint(
        'The error encountered with the edit.',
      );
      const errorText = tb.render.getByText(e.reason);
      expect(a11yError).toBeTruthy();
      expect(errorText).toBeTruthy();
    });

    test('it should dispatch the updated memory to redux', async () => {
      const updatedMemory: Memory = {...tb.memory, title: 'brand new title'};
      tb.onPatchResolve(updatedMemory).pressSubmitButton();

      await waitFor(() => {
        if (tb.dispatchFn.mock.calls.length === 0) {
          throw new Error('Zero calls');
        }
      });

      expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
      expect(tb.dispatchFn).toHaveBeenCalledWith(
        updateMemory({
          mid: updatedMemory.id,
          memory: updatedMemory,
        }),
      );
    });
  });
});

class EditMemoryScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  selectedTag: Tag = {name: 'Test Tag', color: '#1a1a1a', tid: 5};
  otherTag: Tag = {name: 'Other Tag', color: '#FFFFFF', tid: 10};
  tags: Tag[] = [this.selectedTag, this.otherTag];

  memory: Memory = {
    id: 5,
    title: 'Test Memory',
    location: 'Test Location',
    date: moment().valueOf(),
    tag: this.selectedTag,
    imageCount: 3,
    videoCount: 4,
    displayContent: undefined,
  };

  goBackFn: jest.Mock;
  patchMemoryFn: jest.SpyInstance<Promise<Memory>, [number, MemoryPatch]>;
  dispatchFn: jest.Mock;

  constructor() {
    this.patchMemoryFn = jest.spyOn(MemoryService, 'patchMemory').mockClear();
    jest.spyOn(TagService, 'getTags').mockResolvedValue(this.tags);
    this.goBackFn = jest.fn();
    this.dispatchFn = jest.fn();
    this.onPatchResolve(this.memory);
  }

  onPatchResolve = (updatedMemory: Memory): EditMemoryScreenTestBed => {
    this.patchMemoryFn.mockResolvedValue(updatedMemory);
    return this;
  };

  onPatchError = (e: ErrorResponse) => {
    this.patchMemoryFn.mockRejectedValue(e);
  };

  setTitleInput = (title: string) => {
    const input = this.render.getByA11yLabel('Set Title');
    fireEvent.changeText(input, title);
    fireEvent(input, 'blur');
  };

  setLocationInput = (location: string): EditMemoryScreenTestBed => {
    const input = this.render.getByA11yLabel('Set Location');
    fireEvent.changeText(input, location);
    fireEvent(input, 'blur');
    return this;
  };

  selectTag = (tagName: string) => {
    const tag = this.render.getByA11yLabel(`Select the tag ${tagName}`);
    fireEvent.press(tag);
  };

  pressSubmitButton = () => {
    const button = this.render.getByA11yLabel('Update Memory');
    fireEvent.press(button);
  };

  isSubmitButtonEnabled = (): boolean => {
    const submit = this.render.getByA11yLabel('Update Memory');
    return submit.props.accessibilityState.disabled === false;
  };

  queryLoadingScreen = (): QueryReturn => {
    return this.render.queryByA11yHint('Waiting for an action to finish...');
  };

  getLoadingScreen = (): ReactTestInstance => {
    return this.render.getByA11yHint('Waiting for an action to finish...');
  };

  build = (): EditMemoryScreenTestBed => {
    this.render = render(
      <SafeAreaProvider
        initialSafeAreaInsets={{top: 1, left: 2, right: 3, bottom: 4}}>
        <EditMemoryScreen
          navigation={{goBack: this.goBackFn} as any}
          route={{params: {mid: this.memory.id}} as any}
          memory={this.memory}
          dispatch={this.dispatchFn}
        />
      </SafeAreaProvider>,
    );
    return this;
  };
}
