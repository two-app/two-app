import 'react-native';
import {
  MemoryState,
  memoryReducer,
  deleteContent,
} from '../../../src/memories/store';
import {Content} from '../../../src/memories/MemoryModels';

describe('MemoriesReducer', () => {
  const baseState: MemoryState = {
    allMemories: [],
    content: {},
  };

  describe('deleteMemoryContent', () => {
    test("it should do nothing for memory that doesn't exist", () => {
      const newState = memoryReducer(
        baseState,
        deleteContent({mid: 1, contentId: 2}),
      );

      expect(newState).toEqual(baseState);
    });

    test("it should do nothing for content that doesn't exist", () => {
      const state: MemoryState = {
        ...baseState,
        content: {
          1: [{...testContent, contentId: 3}],
        },
      };

      const newState = memoryReducer(
        state,
        deleteContent({mid: 1, contentId: 2}),
      );

      expect(newState).toEqual(state);
    });

    test('it should delete the content', () => {
      const state: MemoryState = {
        ...baseState,
        content: {
          1: [{...testContent, contentId: 3}],
        },
      };

      const newState = memoryReducer(
        state,
        deleteContent({mid: 1, contentId: 3}),
      );

      expect(newState).toEqual({
        ...baseState,
        content: {
          1: [],
        },
      });
    });

    test('it should only delete one piece of content', () => {
      const state: MemoryState = {...baseState, content: {
        1: [{
          ...testContent,
          contentId: 1
        }, {
          ...testContent,
          contentId: 2
        }, {
          ...testContent,
          contentId: 3
        }]
      }};

      const newState = memoryReducer(
        state,
        deleteContent({mid: 1, contentId: 2}),
      );

      expect(newState.content[1].length).toEqual(2);
    });
  });
});

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
