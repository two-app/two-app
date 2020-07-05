import 'react-native';
import React from 'react';
import {Text} from 'react-native';
import {
  render,
  RenderAPI,
  fireEvent,
  cleanup,
  waitFor
} from 'react-native-testing-library';
import * as ContentService from '../../../src/content/ContentService';
import {MemoryInteractionModal} from '../../../src/memories/memory/MemoryInteractionModal';
import moment from 'moment';
import {Memory, Content} from '../../../src/memories/MemoryModels';
import {ErrorResponse} from '../../../src/http/Response';

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

      test('it should display an error if one occurs', async () => {
        const e: ErrorResponse = {
          code: 400,
          reason: 'Test Reason',
          status: 'Bad Request',
        };

        tb.onSetMemoryDisplayPictureReject(e).pressUpdateDisplayContentButton();
        await waitFor(() => tb.render.getByText(e.reason));

        expect(
          tb.render.getByText(e.reason).props.accessibilityLabel
        ).toEqual('Resulting error from your action.');
      });
    });
  });
});

class MemoryInteractionModalTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);
  memory: Memory = testMemory;
  content: Content | undefined;
  onCloseFn: jest.Mock;
  setMemoryDisplayPictureFn: jest.SpyInstance<Promise<Memory>, [number, number]>;

  constructor() {
    this.content = undefined;
    this.onCloseFn = jest.fn();
    this.setMemoryDisplayPictureFn = jest.spyOn(
      ContentService,
      'setMemoryDisplayPicture',
    );
    this.onSetMemoryDisplayPictureResolve();
  }

  setContent = (content: Content): MemoryInteractionModalTestBed => {
    this.content = content;
    return this;
  };

  onSetMemoryDisplayPictureResolve = (): MemoryInteractionModalTestBed => {
    // TODO write tests for updated memory dispatch fn
    this.setMemoryDisplayPictureFn.mockResolvedValue({} as Memory);
    return this;
  };

  onSetMemoryDisplayPictureReject = (
    e: ErrorResponse,
  ): MemoryInteractionModalTestBed => {
    this.setMemoryDisplayPictureFn.mockRejectedValue(e);
    return this;
  };

  pressUpdateDisplayContentButton = (): MemoryInteractionModalTestBed => {
    const btn = this.render.getByA11yLabel('Set the Display Picture');
    fireEvent.press(btn);
    return this;
  };

  isModalVisible = (): boolean => {
    return this.render.getAllByTestId('interaction-modal')[0].props.visible
  }

  build = (): MemoryInteractionModalTestBed => {
    this.render = render(
      <MemoryInteractionModal
        memory={this.memory}
        content={this.content}
        onClose={this.onCloseFn}
        // TODO write tests
        dispatch={jest.fn()}
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
  content: [],
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
