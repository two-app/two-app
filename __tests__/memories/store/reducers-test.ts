import 'react-native';
import {
  MemoryState,
  memoryReducer,
  deleteContent,
} from '../../../src/memories/store';
import {Content} from '../../../src/content/ContentModels';
import {v4 as uuid} from 'uuid';

describe('MemoriesReducer', () => {
  const baseState: MemoryState = {
    allMemories: [],
    content: {},
  };

  describe('deleteMemoryContent', () => {
    test("it should do nothing for memory that doesn't exist", () => {
      const newState = memoryReducer(
        baseState,
        deleteContent({mid: uuid(), contentId: uuid()}),
      );

      expect(newState).toEqual(baseState);
    });

    test("it should do nothing for content that doesn't exist", () => {
      const mid = uuid();
      const state: MemoryState = {
        ...baseState,
        content: {
          mid: [{...testContent, contentId: uuid()}],
        },
      };

      const newState = memoryReducer(
        state,
        deleteContent({mid, contentId: uuid()}),
      );

      expect(newState).toEqual(state);
    });

    test('it should delete the content', () => {
      const mid = uuid();
      const contentId = uuid();

      const state: MemoryState = {
        ...baseState,
        content: {
          [mid]: [{...testContent, contentId}],
        },
      };

      const newState = memoryReducer(state, deleteContent({mid, contentId}));

      expect(newState).toEqual({
        ...baseState,
        content: {
          [mid]: [],
        },
      });
    });

    test('it should only delete one piece of content', () => {
      // GIVEN
      const mid = uuid();
      const content = [1, 2, 3].map(_ => ({
        ...testContent,
        contentId: uuid(),
      }));

      const state: MemoryState = {
        ...baseState,
        content: {
          [mid]: content,
        },
      };

      // WHEN

      const newState = memoryReducer(
        state,
        deleteContent({mid, contentId: content[1].contentId}),
      );

      // THEN
      expect(newState.content[mid].length).toEqual(2);
    });
  });
});

const testContent: Content = {
  contentId: uuid(),
  mid: uuid(),
  contentType: 'image',
  initialWidth: 1200,
  initialHeight: 1200,
  initialSize: 13500,
  thumbnail: {
    mime: 'image/png',
    extension: 'png',
    height: 100,
    width: 100,
    suffix: 'thumbnail',
    size: 500,
  },
  display: {
    mime: 'image/png',
    extension: 'png',
    height: 500,
    width: 500,
    suffix: 'display',
    size: 800,
  },
  gallery: {
    mime: 'image/png',
    extension: 'png',
    height: 1000,
    width: 1000,
    suffix: 'gallery',
    size: 1000,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};
