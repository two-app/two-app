import {Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render, fireEvent, waitFor} from '@testing-library/react-native';

import {EditMemoryScreen} from '../../../src/memories/memory/EditMemoryScreen';
import type {Memory, MemoryMeta} from '../../../src/memories/MemoryModels';
import * as TagService from '../../../src/tags/TagService';
import type {Tag} from '../../../src/tags/Tag';
import * as MemoryService from '../../../src/memories/MemoryService';
import type {ErrorResponse} from '../../../src/http/Response';
import {v4 as uuid} from 'uuid';
import {
  mockNavigation,
  mockNavigationProps,
  mockRoute,
} from '../../utils/NavigationMocking';
import {useMemoryStore} from '../../../src/memories/MemoryStore';

describe('EditMemoryScreen', () => {
  let tb: EditMemoryScreenTestBed;

  beforeEach(() => (tb = new EditMemoryScreenTestBed().build()));

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

    test('submitting a deselected tag should pass value -1 for tag id', () => {
      // GIVEN
      const expected: MemoryMeta = {
        mid: tb.memory.mid,
        title: tb.memory.title,
        location: tb.memory.location,
        occurredAt: tb.memory.occurredAt,
        displayContentId: undefined,
        tid: undefined,
      };

      tb.selectTag(tb.selectedTag.name); // deselect tag

      tb.pressSubmitButton();

      expect(tb.updateMemory).toHaveBeenCalledTimes(1);
      expect(tb.updateMemory).toHaveBeenCalledWith(expected);
    });
  });

  describe('Submitting an Edit', () => {
    beforeEach(() => {
      tb.setTitleInput('New Title');
      tb.setLocationInput('New Location');
      tb.selectTag(tb.otherTag.name);
    });

    test('it should calculate the correct patch', () => {
      // GIVEN
      const expected: MemoryMeta = {
        mid: tb.memory.mid,
        occurredAt: tb.memory.occurredAt,
        title: 'New Title',
        location: 'New Location',
        tid: tb.otherTag.tid,
      };

      // WHEN
      tb.pressSubmitButton();

      expect(tb.updateMemory).toHaveBeenCalledTimes(1);
      expect(tb.updateMemory).toHaveBeenCalledWith(expected);
    });

    test('it should show a loading indicator', () => {
      tb.updateMemory.mockReturnValue(new Promise(() => {}));

      tb.pressSubmitButton();

      expect(tb.isSubmitted()).toBe(true);
    });

    test('it should navigate to the previous screen', async () => {
      tb.pressSubmitButton();

      await tb.waitForCall(mockNavigation.goBack);

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });

    test('it should display an error for a rejected patch', async () => {
      const e: ErrorResponse = {
        status: 400,
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

    test('it should store the updated memory in state', async () => {
      const updatedMemory: Memory = {...tb.memory, title: 'brand new title'};
      tb.onPatchResolve(updatedMemory);

      // WHEN
      tb.pressSubmitButton();

      await tb.waitForCall(mockNavigation.goBack);

      expect(useMemoryStore.getState().all).toEqual([updatedMemory]);
    });
  });
});

class EditMemoryScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  selectedTag: Tag = {
    name: 'Test Tag',
    color: '#1a1a1a',
    tid: uuid(),
    memoryCount: 0,
  };
  otherTag: Tag = {
    name: 'Other Tag',
    color: '#FFFFFF',
    tid: uuid(),
    memoryCount: 0,
  };

  tags: Tag[] = [this.selectedTag, this.otherTag];

  memory: Memory = {
    mid: uuid(),
    title: 'Test Memory',
    location: 'Test Location',
    createdAt: new Date(),
    occurredAt: new Date(),
    tag: this.selectedTag,
    imageCount: 3,
    videoCount: 4,
    displayContent: undefined,
  };

  updateMemory: jest.SpyInstance<Promise<Memory>, [MemoryMeta]>;

  constructor() {
    this.updateMemory = jest.spyOn(MemoryService, 'updateMemory').mockClear();
    jest.spyOn(TagService, 'getTags').mockResolvedValue(this.tags);
    this.onPatchResolve(this.memory);
  }

  onPatchResolve = (updatedMemory: Memory): EditMemoryScreenTestBed => {
    this.updateMemory.mockResolvedValue(updatedMemory);
    return this;
  };

  onPatchError = (e: ErrorResponse) => {
    this.updateMemory.mockRejectedValue(e);
  };

  setTitleInput = (title: string) => {
    const input = this.render.getByA11yLabel('Enter Memory Title');
    fireEvent(input, 'onChangeText', title);
    fireEvent(input, 'onBlur');
  };

  setLocationInput = (location: string) => {
    const input = this.render.getByA11yLabel('Enter Memory Location');
    fireEvent(input, 'onChangeText', location);
    fireEvent(input, 'onBlur');
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

  isSubmitted = (): boolean => {
    const submit = this.render.getByA11yLabel('Update Memory');
    return submit.props.accessibilityState.busy === true;
  };

  waitForCall = (fn: jest.Mock<any>): Promise<void> => {
    return waitFor(() => {
      if (fn.mock.calls.length === 0) {
        throw new Error('Zero calls');
      }
    });
  };

  build = (): EditMemoryScreenTestBed => {
    useMemoryStore.setState({all: [this.memory]});
    mockRoute.params.mid = this.memory.mid;

    this.render = render(<EditMemoryScreen {...mockNavigationProps()} />);
    return this;
  };
}
