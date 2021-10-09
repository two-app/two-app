import {Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';

import * as ContentService from '../../../src/content/ContentService';
import {MemoryInteractionModal} from '../../../src/memories/memory/MemoryInteractionModal';
import type {Memory} from '../../../src/memories/MemoryModels';
import type {ErrorResponse} from '../../../src/http/Response';
import type {Content} from '../../../src/content/ContentModels';
import type {DeleteContentResponse} from '../../../src/content/ContentService';
import {store} from '../../../src/state/reducers';
import uuidv4 from 'uuidv4';

describe('MemoryInteractionModal', () => {
  let tb: MemoryInteractionModalTestBed;

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
          tb.memory.mid,
          testContent.contentId,
        );
      });

      test('it should update the memory in the global state', async () => {
        // GIVEN a memory has content in global
        store.getState().memories.allMemories.push(testMemory);

        // GIVEN the update succeeds
        const updatedMemory: Memory = {...tb.memory, title: 'another title'}; // any update will do
        tb.onSetMemoryDisplayPictureResolve(updatedMemory);

        // WHEN the update display content button is pressed
        tb.pressUpdateDisplayContentButton();
        await waitFor(() => {
          if (tb.isModalVisible()) {
            throw new Error('Modal still visible');
          }
        });

        // THEN the redux state should be updated to the latest memory

        expect(store.getState().memories.allMemories).toEqual([updatedMemory]);
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
          tb.memory.mid,
          testContent.contentId,
        );
      });

      test('it should update the state in redux', async () => {
        // GIVEN the a memory and its associated content
        store.getState().memories.allMemories.push(testMemory);
        store.getState().memories.content[testMemory.mid] = [testContent];
        tb.onDeleteMemoryContentResolve();

        // WHEN the delete button is pressed
        tb.pressDeleteContentButton();
        await waitFor(() => {
          if (tb.isModalVisible()) {
            throw new Error('Modal still visible');
          }
        });

        expect(store.getState().memories.content[testMemory.mid]).toEqual([]);
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
  content?: Content;
  onCloseFn: jest.Mock;
  setMemoryDisplayPictureFn: jest.SpyInstance<
    Promise<Memory>,
    [string, string]
  >;
  deleteContentFn: jest.SpyInstance<
    Promise<DeleteContentResponse>,
    [string, string]
  >;

  constructor() {
    this.content = undefined;
    this.onCloseFn = jest.fn();

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
      <Provider store={store}>
        <MemoryInteractionModal
          memory={this.memory}
          content={this.content}
          onClose={this.onCloseFn}
        />
      </Provider>,
    );
    return this;
  };
}

const testMemory: Memory = {
  mid: uuidv4(),
  title: 'Test Memory',
  location: 'Test Location',
  occurredAt: new Date(),
  createdAt: new Date(),
  tag: undefined,
  imageCount: 0,
  videoCount: 0,
  displayContent: undefined,
};

const testContent: Content = {
  contentId: uuidv4(),
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
