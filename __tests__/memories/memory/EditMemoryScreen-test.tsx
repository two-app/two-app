import 'react-native';
import React from 'react';
import {Text} from 'react-native';
import {
  render,
  RenderAPI,
  fireEvent,
  cleanup,
  waitFor,
  within,
  waitForElementToBeRemoved,
} from 'react-native-testing-library';
import {EditMemoryScreen} from '../../../src/memories/memory/EditMemoryScreen';
import {Memory, MemoryPatch} from '../../../src/memories/MemoryModels';
import moment from 'moment';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as TagService from '../../../src/tags/TagService';
import {Tag} from '../../../src/tags/Tag';
import * as MemoryService from '../../../src/memories/MemoryService';
import {ErrorResponse} from '../../../src/http/Response';

describe('EditMemoryScreen', () => {
  let tb: EditMemoryScreenTestBed;

  beforeEach(() => (tb = new EditMemoryScreenTestBed().build()));
  afterEach(cleanup);
  beforeAll(jest.useRealTimers); // required for the waitFor function to work

  test('it should have edit memory title', () => {
    expect(tb.render.getByText('Edit Memory')).toBeTruthy();
  });

  test('the submit button should be disabled by default', () => {
    const submit = tb.render.getByA11yLabel('Update Memory');
    expect(submit.props.accessibilityState).toEqual({disabled: true});
  });

  describe('Modifying the Title', () => {
    test('it should enable the submit button', () => {
      const input = tb.render.getByA11yLabel('Set Title');
      fireEvent.changeText(input, 'New Title');

      fireEvent(input, 'blur');

      const submit = tb.render.getByA11yLabel('Update Memory');
      expect(submit.props.accessibilityState).toEqual({disabled: false});
    });

    test('it should disable the submit button for length 0', () => {
      const input = tb.render.getByA11yLabel('Set Title');
      fireEvent.changeText(input, '');

      fireEvent(input, 'blur');

      const submit = tb.render.getByA11yLabel('Update Memory');
      expect(submit.props.accessibilityState).toEqual({disabled: true});
    });
  });

  describe('Modifying the Location', () => {
    test('it should enable the submit button', () => {
      const input = tb.render.getByA11yLabel('Set Location');
      fireEvent.changeText(input, 'New Title');

      fireEvent(input, 'blur');

      const submit = tb.render.getByA11yLabel('Update Memory');
      expect(submit.props.accessibilityState).toEqual({disabled: false});
    });

    it('it should disable the submit button for length 0', () => {
      const input = tb.render.getByA11yLabel('Set Location');
      fireEvent.changeText(input, '');

      fireEvent(input, 'blur');

      const submit = tb.render.getByA11yLabel('Update Memory');
      expect(submit.props.accessibilityState).toEqual({disabled: true});
    });
  });

  describe('Modifying the Tag', () => {
    test('removing the tag should enable the submit button', () => {
      const tag = tb.render.getByA11yLabel(
        `Select the tag ${tb.selectedTag.name}`,
      );

      fireEvent.press(tag); // deselect the tag

      const submit = tb.render.getByA11yLabel('Update Memory');
      expect(submit.props.accessibilityState).toEqual({disabled: false});
    });

    test('changing the tag should enable the submit button', () => {
      const tag = tb.render.getByA11yLabel(
        `Select the tag ${tb.otherTag.name}`,
      );

      fireEvent.press(tag); // select the other tag

      const submit = tb.render.getByA11yLabel('Update Memory');
      expect(submit.props.accessibilityState).toEqual({disabled: false});
    });

    test('removing and readding the tag should disable the button', () => {
      const tag = tb.render.getByA11yLabel(
        `Select the tag ${tb.selectedTag.name}`,
      );

      fireEvent.press(tag); // deselect the tag
      fireEvent.press(tag); // reselect the tag

      const submit = tb.render.getByA11yLabel('Update Memory');
      expect(submit.props.accessibilityState).toEqual({disabled: true});
    });

    test('submitting a deselected tag should pass value -1 for tag id', () => {
      const tag = tb.render.getByA11yLabel(
        `Select the tag ${tb.selectedTag.name}`,
      );

      fireEvent.press(tag); // deselect the tag

      const submit = tb.render.getByA11yLabel('Update Memory');
      fireEvent.press(submit);

      expect(tb.patchMemoryFn).toHaveBeenCalledTimes(1);
      expect(tb.patchMemoryFn).toHaveBeenCalledWith(tb.memory.id, {
        tagId: -1,
      });
    });
  });

  describe('Submitting an Edit', () => {
    beforeEach(() => {
      const title = tb.render.getByA11yLabel('Set Title');
      fireEvent.changeText(title, 'New Title');
      fireEvent(title, 'blur');

      const location = tb.render.getByA11yLabel('Set Location');
      fireEvent.changeText(location, 'New Location');
      fireEvent(location, 'blur');

      const tag = tb.render.getByA11yLabel(
        `Select the tag ${tb.otherTag.name}`,
      );
      fireEvent.press(tag); // select the other tag
    });

    test('it should calculate the correct patch', () => {
      const submit = tb.render.getByA11yLabel('Update Memory');

      fireEvent.press(submit);

      expect(tb.patchMemoryFn).toHaveBeenCalledTimes(1);
      expect(tb.patchMemoryFn).toHaveBeenCalledWith(tb.memory.id, {
        title: 'New Title',
        location: 'New Location',
        tagId: tb.otherTag.tid,
      });
    });

    test('it should set show a loading indicator', () => {
      tb.patchMemoryFn.mockReturnValue(new Promise(() => {}));
      const submit = tb.render.getByA11yLabel('Update Memory');

      fireEvent.press(submit);

      expect(
        tb.render.getByA11yHint('Waiting for an action to finish...'),
      ).toBeTruthy();
    });

    test('it should navigate to the previous screen', async () => {
      const submit = tb.render.getByA11yLabel('Update Memory');

      fireEvent.press(submit);

      await waitFor(() => {
        if (tb.goBackFn.mock.calls.length == 0) throw new Error('Zero calls');
      });

      expect(tb.goBackFn).toHaveBeenCalledTimes(1);
    });

    test('it should hide the loading indicator when complete', async () => {
      const submit = tb.render.getByA11yLabel('Update Memory');

      fireEvent.press(submit);
      await waitForElementToBeRemoved(() =>
        tb.render.queryByA11yHint('Waiting for an action to finish...'),
      );

      expect(
        tb.render.queryByA11yHint('Waiting for an action to finish...'),
      ).toBeFalsy();
    });

    test('it should display an error for a rejected patch', async () => {
      const e: ErrorResponse = {
        status: 'Bad Request',
        code: 400,
        reason: 'Something went wrong.',
      };

      tb.onPatchError(e);

      const submit = tb.render.getByA11yLabel('Update Memory');
      fireEvent.press(submit);
      await waitFor(() => tb.render.getByText(e.reason));

      expect(tb.render.getByText(e.reason)).toBeTruthy();

      const a11yError = tb.render.getByA11yHint('The error encountered with the edit.');
      const errorText = tb.render.getByText(e.reason);
      expect(a11yError).toBeTruthy();
      expect(errorText).toBeTruthy();
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
    content: [],
    imageCount: 3,
    videoCount: 4,
    displayContent: undefined,
  };

  goBackFn: jest.Mock;
  patchMemoryFn: jest.SpyInstance<Promise<void>, [number, MemoryPatch]>;

  constructor() {
    this.patchMemoryFn = jest.spyOn(MemoryService, 'patchMemory').mockClear();
    jest.spyOn(TagService, 'getTags').mockResolvedValue(this.tags);
    this.goBackFn = jest.fn();
    this.onPatchResolve();
  }

  onPatchResolve = (): EditMemoryScreenTestBed => {
    this.patchMemoryFn.mockResolvedValue();
    return this;
  };

  onPatchError = (e: ErrorResponse) => {
    this.patchMemoryFn.mockRejectedValue(e);
  };

  build = (): EditMemoryScreenTestBed => {
    this.render = render(
      <SafeAreaProvider
        initialSafeAreaInsets={{top: 1, left: 2, right: 3, bottom: 4}}>
        <EditMemoryScreen
          navigation={{goBack: this.goBackFn} as any}
          route={{params: {memory: this.memory}} as any}
        />
      </SafeAreaProvider>,
    );
    return this;
  };
}
