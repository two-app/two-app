import {Text} from 'react-native';
import React from 'react';
import {
  render,
  RenderAPI,
  fireEvent,
  cleanup,
  waitFor,
} from 'react-native-testing-library';
import moment from 'moment';

import * as ContentService from '../../../src/content/ContentService';
import {MemoryInteractionModal} from '../../../src/memories/memory/MemoryInteractionModal';
import {Memory} from '../../../src/memories/MemoryModels';
import {ErrorResponse} from '../../../src/http/Response';
import {updateMemory, deleteContent} from '../../../src/memories/store';
import {Content} from '../../../src/content/ContentModels';
import {DeleteContentResponse} from '../../../src/content/ContentService';

describe('MemoryInteractionModal', () => {
  let tb: MemoryInteractionModalTestBed;

  afterEach(cleanup);
  beforeAll(jest.useRealTimers); // required for the waitFor function to work

  describe('With no content selected', () => {
    beforeEach(() => (tb = new MemoryInteractionModalTestBed().build()));

    test('it should not display the modal', () => {
      expect(tb.isModalVisible()).toBe(false);
    });
  });

  describe('With content selected', () => {
    beforeEach(() => {
      tb = new MemoryInteractionModalTestBed().setContent(testContent).build();
    });

    test('it should display an image', () => {
      expect(
        tb.render.getByA11yLabel('A preview of selected content.'),
      ).toBeTruthy();
    });

    describe('Updating the display content', () => {
      test('it should send a request with the content id', () => {
        tb.pressUpdateDisplayContentButton();

        expect(tb.setMemoryDisplayPictureFn).toHaveBeenCalledTimes(1);
        expect(tb.setMemoryDisplayPictureFn).toHaveBeenCalledWith(
          tb.memory.id,
          tb.content!.contentId,
        );
      });

      test('it should update the state in redux', async () => {
        const updatedMemory: Memory = {...tb.memory, title: 'another title'}; // any update will do
        tb.onSetMemoryDisplayPictureResolve(updatedMemory);

        tb.pressUpdateDisplayContentButton();
        await waitFor(() => {
          if (tb.isModalVisible()) {
            throw new Error('Modal still visible');
          }
        });

        expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
        expect(tb.dispatchFn).toHaveBeenCalledWith(
          updateMemory({mid: updatedMemory.id, memory: updatedMemory}),
        );
      });

      test('it should display an error if one occurs', async () => {
        const e: ErrorResponse = {
          code: 400,
          reason: 'Test Reason',
          status: 'Bad Request',
        };

        tb.onSetMemoryDisplayPictureReject(e).pressUpdateDisplayContentButton();
        await waitFor(() => tb.render.getByText(e.reason));

        expect(tb.render.getByText(e.reason).props.accessibilityLabel).toEqual(
          'Resulting error from your action.',
        );
      });
    });

    describe('Deleting the content', () => {
      test('it should send a request with the content id', () => {
        tb.pressDeleteContentButton();

        expect(tb.deleteContentFn).toHaveBeenCalledTimes(1);
        expect(tb.deleteContentFn).toHaveBeenCalledWith(
          tb.memory.id,
          tb.content!.contentId,
        );
      });

      test('it should update the state in redux', async () => {
        tb.onDeleteMemoryContentResolve();

        tb.pressDeleteContentButton();
        await waitFor(() => {
          if (tb.isModalVisible()) {
            throw new Error('Modal still visible');
          }
        });

        expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
        expect(tb.dispatchFn).toHaveBeenCalledWith(
          deleteContent({mid: tb.memory.id, contentId: testContent.contentId}),
        );
      });

      test('it should display an error if one occurs', async () => {
        const e: ErrorResponse = {
          code: 400,
          reason: 'Test Reason',
          status: 'Bad Request',
        };

        tb.onDeleteMemoryContentReject(e).pressDeleteContentButton();
        await waitFor(() => tb.render.getByText(e.reason));

        expect(tb.render.getByText(e.reason).props.accessibilityLabel).toEqual(
          'Resulting error from your action.',
        );
      });
    });
  });
});

class MemoryInteractionModalTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);
  memory: Memory = testMemory;
  content: Content | undefined;
  onCloseFn: jest.Mock;
  dispatchFn: jest.Mock;
  setMemoryDisplayPictureFn: jest.SpyInstance<
    Promise<Memory>,
    [number, number]
  >;
  deleteContentFn: jest.SpyInstance<
    Promise<DeleteContentResponse>,
    [number, number]
  >;

  constructor() {
    this.content = undefined;
    this.onCloseFn = jest.fn();
    this.dispatchFn = jest.fn();

    this.setMemoryDisplayPictureFn = jest.spyOn(
      ContentService,
      'setMemoryDisplayPicture',
    );

    this.deleteContentFn = jest.spyOn(ContentService, 'deleteContent');

    this.onSetMemoryDisplayPictureResolve(this.memory);
    this.onDeleteMemoryContentResolve();
  }

  setContent = (content: Content): MemoryInteractionModalTestBed => {
    this.content = content;
    return this;
  };

  onSetMemoryDisplayPictureResolve = (
    memory: Memory,
  ): MemoryInteractionModalTestBed => {
    this.setMemoryDisplayPictureFn.mockResolvedValue(memory);
    return this;
  };

  onSetMemoryDisplayPictureReject = (
    e: ErrorResponse,
  ): MemoryInteractionModalTestBed => {
    this.setMemoryDisplayPictureFn.mockRejectedValue(e);
    return this;
  };

  onDeleteMemoryContentResolve = (): MemoryInteractionModalTestBed => {
    // TODO fix the tests that use this
    this.deleteContentFn.mockResolvedValue({} as any);
    return this;
  };

  onDeleteMemoryContentReject = (
    e: ErrorResponse,
  ): MemoryInteractionModalTestBed => {
    this.deleteContentFn.mockRejectedValue(e);
    return this;
  };

  pressUpdateDisplayContentButton = (): MemoryInteractionModalTestBed => {
    const btn = this.render.getByA11yLabel('Set the Display Picture');
    fireEvent.press(btn);
    return this;
  };

  pressDeleteContentButton = (): MemoryInteractionModalTestBed => {
    const btn = this.render.getByA11yLabel('Delete this content.');
    fireEvent.press(btn);
    return this;
  };

  isModalVisible = (): boolean => {
    return this.render.getAllByTestId('interaction-modal')[0].props.visible;
  };

  build = (): MemoryInteractionModalTestBed => {
    this.render = render(
      <MemoryInteractionModal
        memory={this.memory}
        content={this.content}
        onClose={this.onCloseFn}
        dispatch={this.dispatchFn}
      />,
    );
    return this;
  };
}

const testMemory: Memory = {
  id: 5,
  title: 'Test Memory',
  location: 'Test Location',
  date: moment().valueOf(),
  tag: undefined,
  imageCount: 0,
  videoCount: 0,
  displayContent: undefined,
};

const testContent: Content = {
  contentId: 9,
  contentType: 'image',
  thumbnail: {
    contentType: 'image',
    extension: 'png',
    height: 100,
    width: 100,
    suffix: 'thumbnail',
  },
  display: {
    contentType: 'image',
    extension: 'png',
    height: 500,
    width: 500,
    suffix: 'display',
  },
  gallery: {
    contentType: 'image',
    extension: 'png',
    height: 1000,
    width: 1000,
    suffix: 'gallery',
  },
  extension: 'png',
  fileKey: 'abcdefg',
};
