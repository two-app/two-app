import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import type {AlertButton} from 'react-native';
import {Alert, Text} from 'react-native';
import {Provider} from 'react-redux';
import {CommonActions} from '@react-navigation/native';

import type {Memory} from '../../../src/memories/MemoryModels';
import * as MemoryService from '../../../src/memories/MemoryService';
import {MemoryToolbar} from '../../../src/memories/memory/MemoryToolbar';
import {
  mockNavigation,
  resetMockNavigation,
} from '../../utils/NavigationMocking';
import {persistor, store} from '../../../src/state/reducers';
import type {PickedContent} from '../../../src/content/ContentPicker';
import {ContentPicker} from '../../../src/content/ContentPicker';
import {v4 as uuid} from 'uuid';

describe('MemoryToolbar', () => {
  let tb: MemoryToolbarTestBed;

  beforeEach(() => (tb = new MemoryToolbarTestBed().build()));

  describe('The Back Button', () => {
    it('should navigate home', () => {
      const backBtn = tb.render.getByA11yLabel('Go Back');

      fireEvent.press(backBtn);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('HomeScreen');
    });
  });

  describe('Edit Memory Button', () => {
    it('should navigate', () => {
      const editBtn = tb.render.getByA11yLabel('Edit Memory');

      fireEvent.press(editBtn);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('EditMemoryScreen', {
        mid: tb.memory.mid,
      });
    });
  });

  describe('Upload Content Button', () => {
    it('should not navigate when content selection is cancelled', () => {
      // GIVEN
      tb.onUploadCancelPick();

      // WHEN
      tb.pressUploadButton();

      // THEN
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to the ContentUploadScreen', () => {
      const content = [tb.createTestContent()];
      tb.onUploadPickContent(content);

      tb.pressUploadButton();

      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        'ContentUploadScreen',
        {
          mid: tb.memory.mid,
          content,
        },
      );
    });

    it('should set the display content for the memory', () => {
      const content = [tb.createTestContent()];

      expect(content[0].setDisplayPicture).toBeFalsy();
      tb.onUploadPickContent(content);

      tb.pressUploadButton();

      expect(content[0].setDisplayPicture).toEqual(true);
    });
  });

  describe('Delete Memory Button', () => {
    it('should do nothing if cancelled', () => {
      tb.onDeleteMemoryCancel();

      tb.pressDeleteButton();

      expect(tb.deleteMemoryFn).not.toHaveBeenCalled();
    });

    it('should delete the memory', async () => {
      // GIVEN global state holds one current memory
      tb.onDeleteMemoryDelete();
      expect(store.getState().memories.allMemories).toEqual([tb.memory]);

      // WHEN
      tb.pressDeleteButton();

      // THEN the delete request should be invoked
      // THEN the screen should navigate to Home using reset
      // THEN the global state should hold no memories
      await waitFor(() => {
        expect(mockNavigation.dispatch).toHaveBeenCalledTimes(1);
        expect(mockNavigation.dispatch).toHaveBeenCalledWith(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
          }),
        );
      });

      expect(tb.deleteMemoryFn).toHaveBeenCalledWith(tb.memory.mid);
      expect(store.getState().memories.allMemories).toEqual([]);
    });
  });
});

class MemoryToolbarTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  deleteMemoryFn: jest.SpyInstance<Promise<void>, [string]>;
  dispatch: jest.SpyInstance<void, []>;
  memory: Memory;

  constructor() {
    this.deleteMemoryFn = jest.spyOn(MemoryService, 'deleteMemory').mockClear();
    this.dispatch = jest.spyOn(persistor, 'persist').mockClear();
    this.memory = {
      mid: uuid(),
      occurredAt: new Date(),
      createdAt: new Date(),
      imageCount: 5,
      videoCount: 19,
      location: 'test location',
      title: 'test title',
      displayContent: undefined,
      tag: undefined,
    };

    store.getState().memories.allMemories.length = 0;
    store.getState().memories.allMemories.push(this.memory);
  }

  onUploadCancelPick = () => {
    jest // spy on ContentPicked and call back cancelled/closed
      .spyOn(ContentPicker, 'open')
      .mockImplementation((onClose, _) => {
        onClose();
      });
  };

  onUploadPickContent = (content: PickedContent[]) => {
    jest // spy on ContentPicked and call back with content
      .spyOn(ContentPicker, 'open')
      .mockImplementation(
        (_, onPickedContent: (content: PickedContent[]) => void) => {
          onPickedContent(content);
        },
      );
  };

  pressUploadButton = () => {
    const uploadBtn = this.render.getByA11yLabel('Upload Content');
    fireEvent.press(uploadBtn);
  };

  createTestContent = (): PickedContent => {
    return {
      height: 100,
      width: 100,
      mime: 'test-mime',
      path: 'test-path',
      size: 10,
    };
  };

  onDeleteMemoryCancel = () => {
    jest.spyOn(Alert, 'alert');
  };

  onDeleteMemoryDelete = () => {
    this.deleteMemoryFn.mockResolvedValue();
    jest
      .spyOn(Alert, 'alert')
      .mockImplementation((_title, _message, buttons) => {
        if (buttons != null) {
          const deleteBtn = buttons[1] as AlertButton;
          deleteBtn.onPress?.();
        }
      });
  };

  pressDeleteButton = () => {
    const deleteBtn = this.render.getByA11yLabel('Delete Memory');
    fireEvent.press(deleteBtn);
  };

  build = (): MemoryToolbarTestBed => {
    resetMockNavigation();
    this.render = render(
      <Provider store={store}>
        <MemoryToolbar memory={this.memory} />
      </Provider>,
    );

    return this;
  };
}
