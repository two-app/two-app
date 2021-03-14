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
} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ReactTestInstance} from 'react-test-renderer';

import * as TagService from '../../src/tags/TagService';
import {Tag, TagDescription} from '../../src/tags/Tag';
import {ErrorResponse} from '../../src/http/Response';
import {TagManagementScreen} from '../../src/tags/tag_management/TagManagementScreen';
import {TagColors} from '../../src/tags/tag_management/TagColors';

describe('TagManagementScreen', () => {
  let tb: TagManagementScreenTestBed;

  beforeEach(() => (tb = new TagManagementScreenTestBed().build()));
  afterEach(cleanup);
  beforeAll(jest.useRealTimers); // required for the waitFor function to work

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
      tb.pressSubmitButton();
      expect(tb.createTagFn).toHaveBeenCalledWith(tagDescription);
    });

    test('it should show a loading indicator', () => {
      tb.pressSubmitButton();
      expect(tb.getLoadingScreen()).toBeTruthy();
    });

    test('it should navigate to the previous screen', async () => {
      const tag: Tag = {...tagDescription, tid: 3};
      tb.onCreateTagResolve(tag);
      tb.pressSubmitButton();

      await waitFor(() => {
        if (tb.goBackFn.mock.calls.length === 0) {
          throw new Error('Zero calls');
        }
      });

      expect(tb.goBackFn).toHaveBeenCalledTimes(1);
      expect(tb.createTagPropCallback).toHaveBeenCalledWith(tag);
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
        reason: 'This tag name already exists.',
      };

      tb.onCreateTagError(e);
      tb.pressSubmitButton();
      await waitFor(() => tb.render.getByText(e.reason));

      expect(tb.render.getByText(e.reason)).toBeTruthy();

      const a11yError = tb.render.getByA11yHint(
        'The error encountered when creating a tag',
      );
      const errorText = tb.render.getByText(e.reason);
      expect(a11yError).toBeTruthy();
      expect(errorText).toBeTruthy();
    });
  });
});

class TagManagementScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  createTagFn: jest.SpyInstance<Promise<Tag>, [TagDescription]>;
  createTagPropCallback: jest.Mock;
  goBackFn: jest.Mock;
  dispatchFn: jest.Mock;

  constructor() {
    this.createTagFn = jest.spyOn(TagService, 'createTag').mockClear();
    this.createTagPropCallback = jest.fn();
    this.goBackFn = jest.fn();
    this.dispatchFn = jest.fn();
    this.onCreateTagError({
      code: -1,
      reason: 'not implemented',
      status: 'not implemented',
    });
  }

  onCreateTagResolve = (tag: Tag): TagManagementScreenTestBed => {
    this.createTagFn.mockResolvedValue(tag);
    return this;
  };

  onCreateTagError = (e: ErrorResponse) => {
    this.createTagFn.mockRejectedValue(e);
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

  pressSubmitButton = () => {
    const button = this.render.getByA11yLabel('Create Tag');
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
      <SafeAreaProvider
        initialSafeAreaInsets={{top: 1, left: 2, right: 3, bottom: 4}}>
        <TagManagementScreen
          navigation={{goBack: this.goBackFn} as any}
          route={
            {
              params: {
                header: 'Some Header',
                onSubmit: this.createTagPropCallback,
              },
            } as any
          }
        />
      </SafeAreaProvider>,
    );
    return this;
  };
}
