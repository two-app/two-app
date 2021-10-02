import {Text} from 'react-native';
import type {RenderAPI, QueryReturn} from '@testing-library/react-native';
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import type {ReactTestInstance} from 'react-test-renderer';

import * as TagService from '../../../src/tags/TagService';
import type {Tag, TagDescription} from '../../../src/tags/Tag';
import type {ErrorResponse} from '../../../src/http/Response';
import {TagManagementScreen} from '../../../src/tags/tag_management/TagManagementScreen';
import {TagColors} from '../../../src/tags/tag_management/TagColors';

describe('TagManagementScreen - Create Mode', () => {
  let tb: TagManagementScreenTestBed;

  beforeEach(() => (tb = new TagManagementScreenTestBed().build()));

  test('the submit button should be disabled by default', () => {
    expect(tb.isSubmitButtonEnabled()).toEqual(false);
  });

  describe('Modifying the tag name', () => {
    test('it should enable the submit button', () => {
      tb.setNameInput('Anniversary');
      expect(tb.isSubmitButtonEnabled()).toEqual(true);
    });

    test('it should disable the submit button with a length of zero', () => {
      tb.setNameInput('');
      expect(tb.isSubmitButtonEnabled()).toEqual(false);
    });
  });

  describe('Modifying the tag color', () => {
    test('it should have a random color selected by default', () => {
      const colorHex = tb.getSelectedColor();
      const color = colorHex.substring(1); // remove prefixed octothorp for hex
      expect(color?.length).toEqual(6);
      expect(!isNaN(Number('0x' + color))).toEqual(true);
    });

    test('it should select a color', () => {
      const prevColor = tb.getSelectedColor();

      // evade the random selection by choosing our test color based on current selection
      const color = prevColor === TagColors[1] ? TagColors[2] : TagColors[1];
      tb.setColorInput(color);

      expect(tb.getSelectedColor()).toEqual(color);
    });
  });

  describe('Submitting a New Tag', () => {
    const tagDescription: TagDescription = {
      name: 'Birthday',
      color: TagColors[3],
    };

    beforeEach(() => {
      tb.setNameInput(tagDescription.name);
      tb.setColorInput(tagDescription.color);
    });

    test('it should message the tag description', () => {
      tb.pressCreateButton();
      expect(tb.createTagFn).toHaveBeenCalledWith(tagDescription);
    });

    test('it should show a loading indicator', () => {
      tb.pressCreateButton();
      expect(tb.getLoadingScreen()).toBeTruthy();
    });

    test('it should navigate to the previous screen', async () => {
      const tag: Tag = {...tagDescription, tid: 3, memoryCount: 0};
      tb.onSubmitTagResolve(tag);
      tb.pressCreateButton();

      await waitFor(() => {
        if (tb.goBackFn.mock.calls.length === 0) {
          throw new Error('Zero calls');
        }
      });

      expect(tb.goBackFn).toHaveBeenCalledTimes(1);
      expect(tb.onSubmitPropCallback).toHaveBeenCalledWith(tag);
    });

    test('it should hide the loading indicator when complete', async () => {
      tb.pressCreateButton();

      await waitForElementToBeRemoved(() => tb.queryLoadingScreen());

      expect(tb.queryLoadingScreen()).toBeFalsy();
    });

    test('it should display an error for a rejected patch', async () => {
      const e: ErrorResponse = {
        status: 'Bad Request',
        code: 400,
        reason: 'This tag name already exists.',
      };

      tb.onSubmitTagError(e);
      tb.pressCreateButton();
      await waitFor(() => tb.render.getByText(e.reason));

      expect(tb.render.getByText(e.reason)).toBeTruthy();

      const a11yError = tb.render.getByA11yHint(
        'The error encountered from processing a tag',
      );
      const errorText = tb.render.getByText(e.reason);
      expect(a11yError).toBeTruthy();
      expect(errorText).toBeTruthy();
    });
  });
});

describe('TagManagementScreen - Edit Mode', () => {
  let tb: TagManagementScreenTestBed;
  const tag: Tag = {
    tid: 3,
    name: 'Some Tag',
    color: '#f4989c',
    memoryCount: 5,
  };

  beforeEach(() => (tb = new TagManagementScreenTestBed(tag).build()));

  test('the color should be set', () => {
    expect(tb.getSelectedColor()).toEqual(tag.color);
  });

  test('the name should be set', () => {
    expect(tb.render.getAllByText(tag.name)).toBeTruthy();
  });

  test('the update function should be called on submit', () => {
    tb.pressUpdateButton();

    expect(tb.updateTagFn).toHaveBeenCalledWith(tag.tid, {
      color: tag.color,
      name: tag.name,
    });
  });
});

class TagManagementScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);
  initialTag?: Tag = undefined;

  createTagFn: jest.SpyInstance<Promise<Tag>, [TagDescription]>;
  updateTagFn: jest.SpyInstance<Promise<Tag>, [number, TagDescription]>;
  onSubmitPropCallback: jest.Mock;
  goBackFn: jest.Mock;
  dispatchFn: jest.Mock;

  constructor(initialTag?: Tag) {
    this.initialTag = initialTag;

    this.createTagFn = jest.spyOn(TagService, 'createTag').mockClear();
    this.updateTagFn = jest.spyOn(TagService, 'updateTag').mockClear();

    this.onSubmitPropCallback = jest.fn();
    this.goBackFn = jest.fn();
    this.dispatchFn = jest.fn();
    this.onSubmitTagError({
      code: -1,
      reason: 'not implemented',
      status: 'not implemented',
    });
  }

  onSubmitTagResolve = (tag: Tag): TagManagementScreenTestBed => {
    this.createTagFn.mockResolvedValue(tag);
    this.updateTagFn.mockResolvedValue(tag);
    return this;
  };

  onSubmitTagError = (e: ErrorResponse) => {
    this.createTagFn.mockRejectedValue(e);
    this.updateTagFn.mockRejectedValue(e);
  };

  setNameInput = (name: string) => {
    const input = this.render.getByA11yLabel('Set Tag Name');
    fireEvent.changeText(input, name);
    fireEvent(input, 'blur');
  };

  setColorInput = (color: string) => {
    const input = this.render.getByA11yHint(`Set the tag color to ${color}`);
    fireEvent.press(input);
  };

  getSelectedColor = (): string => {
    return this.render.getByTestId('selected-color').props.accessibilityLabel;
  };

  pressCreateButton = () => {
    const button = this.render.getByA11yLabel('Create Tag');
    fireEvent.press(button);
  };

  pressUpdateButton = () => {
    const button = this.render.getByA11yLabel('Update Tag');
    fireEvent.press(button);
  };

  isSubmitButtonEnabled = (): boolean => {
    const submit = this.render.getByA11yLabel('Create Tag');
    return submit.props.accessibilityState.disabled === false;
  };

  queryLoadingScreen = (): QueryReturn => {
    return this.render.queryByA11yHint('Waiting for an action to finish...');
  };

  getLoadingScreen = (): ReactTestInstance => {
    return this.render.getByA11yHint('Waiting for an action to finish...');
  };

  build = (): TagManagementScreenTestBed => {
    this.render = render(
      <TagManagementScreen
        navigation={{goBack: this.goBackFn} as any}
        route={{
          params: {
            onSubmit: this.onSubmitPropCallback,
            initialTag: this.initialTag,
          },
          key: '',
          name: 'TagManagementScreen',
        }}
      />,
    );
    return this;
  };
}
