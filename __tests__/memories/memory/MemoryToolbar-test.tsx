import type {RenderAPI} from '@testing-library/react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import type {AlertButton} from 'react-native';
import {Alert, Text} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import type {Memory} from '../../../src/memories/MemoryModels';
import * as MemoryService from '../../../src/memories/MemoryService';
import {MemoryToolbar} from '../../../src/memories/memory/MemoryToolbar';
import {mockNavigation} from '../../utils/NavigationMocking';
import {ContentPicker} from '../../../src/content/ContentPicker';
import {v4 as uuid} from 'uuid';
import {ContentFiles} from '../../../src/content/compression/Compression';
import {useMemoryStore} from '../../../src/memories/MemoryStore';

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
      expect(useMemoryStore.getState().all).toEqual([tb.memory]);

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
      expect(useMemoryStore.getState().all).toEqual([]);
    });
  });
});

class MemoryToolbarTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  deleteMemoryFn: jest.SpyInstance<Promise<void>, [string]>;
  memory: Memory;

  constructor() {
    this.deleteMemoryFn = jest.spyOn(MemoryService, 'deleteMemory').mockClear();
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

    useMemoryStore.setState({all: [this.memory]});
  }

  onUploadCancelPick = () => {
    jest.spyOn(ContentPicker, 'open').mockResolvedValue([]);
  };

  onUploadPickContent = (content: ContentFiles) => {
    jest.spyOn(ContentPicker, 'open').mockResolvedValue([content]);
  };

  pressUploadButton = () => {
    const uploadBtn = this.render.getByA11yLabel('Upload Content');
    fireEvent.press(uploadBtn);
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
    this.render = render(<MemoryToolbar memory={this.memory} />);
    return this;
  };
}
