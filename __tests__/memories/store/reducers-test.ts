import 'react-native';
import {
  MemoryState,
  memoryReducer,
  deleteContent,
} from '../../../src/memories/store';
import {Content} from '../../../src/content/ContentModels';
import {uuid} from 'uuidv4';

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
