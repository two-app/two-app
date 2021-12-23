import {
  fireEvent,
  QueryReturn,
  render,
  RenderAPI,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import {Platform, Text} from 'react-native';
import {Provider} from 'react-redux';
import {ReactTestInstance} from 'react-test-renderer';
import {NewMemoryScreen} from '../../../src/memories/new_memory/NewMemoryScreen';
import {clearState, store} from '../../../src/state/reducers';
import {Tag} from '../../../src/tags/Tag';
import * as TagService from '../../../src/tags/TagService';
import * as MemoryService from '../../../src/memories/MemoryService';
import {
  mockNavigation,
  resetMockNavigation,
} from '../../utils/NavigationMocking';
import {Memory, MemoryMeta} from '../../../src/memories/MemoryModels';
import {ErrorResponse} from '../../../src/http/Response';
import {uuid} from 'uuidv4';

describe('NewMemoryScreen', () => {
  let tb: NewMemoryScreenTestBed;

  beforeEach(() => (tb = new NewMemoryScreenTestBed().build()));

  test('submit should be disabled on first load', () => {
    expect(tb.isSubmitEnabled()).toEqual(false);
  });

  describe('on submit', () => {
    beforeEach(() => {
      tb.setTitle(testMemory.title);
      tb.setLocation(testMemory.location);
    });

    test('submit should be enabled', () => {
      expect(tb.isSubmitEnabled()).toEqual(true);
    });

    test('it should store the state and navigate', async () => {
      // GIVEN the memory gets created
      tb.onCreateMemoryResolve(testMemory);

      // WHEN
      await tb.pressSubmit();

      // THEN it should store the state and navigate
      expect(tb.createMemorySpy).toHaveBeenCalledTimes(1);
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 1,
        routes: [
          {name: 'HomeScreen'},
          {name: 'MemoryScreen', params: {mid: testMemory.mid}},
        ],
      });
      expect(store.getState().memories.allMemories).toEqual([testMemory]);
    });

    test('it should retrieve the memory on 409 conflict', async () => {
      // GIVEN the memory already exists
      tb.onCreateMemoryReject({
        status: 409,
        reason: 'Conflict',
      });

      tb.onGetMemoryResolve(testMemory);

      // WHEN
      await tb.pressSubmit();

      // THEN it should check creation via getMemory
      expect(tb.createMemorySpy).toHaveBeenCalledTimes(1);
      expect(tb.getMemorySpy).toHaveBeenCalledTimes(1);

      // THEN it should store and navigate
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 1,
        routes: [
          {name: 'HomeScreen'},
          {name: 'MemoryScreen', params: {mid: testMemory.mid}},
        ],
      });
      expect(store.getState().memories.allMemories).toEqual([testMemory]);
    });

    test('it should display errors', async () => {
      tb.onCreateMemoryReject({
        status: 400,
        reason: 'Some Error',
      });

      // WHEN
      await tb.pressSubmit();

      // THEN
      expect(tb.render.getByText('Some Error')).toBeTruthy();
      expect(
        tb.render.getByA11yLabel('Something went wrong creating your memory.'),
      ).toBeTruthy();
    });

    test('it should display retry/conflict errors', async () => {
      tb.onCreateMemoryReject({
        status: 409,
        reason: 'Conflcit',
      });

      tb.onGetMemoryReject({
        status: 500,
        reason: 'Internal Error',
      });

      // WHEN
      await tb.pressSubmit();

      // THEN
      expect(tb.render.getByText('Internal Error')).toBeTruthy();
      expect(
        tb.render.getByA11yLabel('Something went wrong creating your memory.'),
      ).toBeTruthy();
    });
  });
});

class NewMemoryScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  getTagsSpy: jest.SpyInstance<Promise<Tag[]>>;
  createMemorySpy: jest.SpyInstance<Promise<Memory>, [MemoryMeta]>;
  getMemorySpy: jest.SpyInstance<Promise<Memory>, [string]>;

  constructor() {
    this.getTagsSpy = jest.spyOn(TagService, 'getTags').mockClear();
    this.createMemorySpy = jest
      .spyOn(MemoryService, 'createMemory')
      .mockClear();
    this.getMemorySpy = jest.spyOn(MemoryService, 'getMemory').mockClear();
    this.onGetTagsResolve([]);
  }

  // elements
  submitButton = () => this.render.getByA11yLabel('Create a new memory');
  titleInput = () => this.render.getByA11yLabel('Set Title');
  locationInput = () => this.render.getByA11yLabel('Set Location');
  dateTimeInput = () => this.render.getByA11yLabel('Set the Date and Time');
  datePicker = () => this.render.getByA11yLabel('Pick the Date');
  timePicker = () => this.render.getByA11yLabel('Pick the Time');

  // queries
  isSubmitEnabled = (): boolean =>
    !this.submitButton().props.accessibilityState.disabled;

  queryLoadingScreen = (): QueryReturn => {
    return this.render.queryByA11yHint('Waiting for an action to finish...');
  };

  // events
  private setInput = (input: ReactTestInstance, text: string) => {
    fireEvent.changeText(input, text);
    fireEvent(input, 'blur');
  };

  setTitle = (title: string) => this.setInput(this.titleInput(), title);
  setLocation = (loc: string) => this.setInput(this.locationInput(), loc);
  setOccuredAt = (date: Date) => {
    fireEvent.press(this.dateTimeInput());
    fireEvent(this.datePicker(), 'onConfirm', date);
    fireEvent(this.timePicker(), 'onConfirm', date);
  };

  pressSubmit = async () => {
    fireEvent.press(this.submitButton());
    await waitForElementToBeRemoved(this.queryLoadingScreen);
  };

  // request/response mocks
  onGetTagsResolve = (tags: Tag[]) => this.getTagsSpy.mockResolvedValue(tags);

  onCreateMemoryResolve = (memory: Memory) =>
    this.createMemorySpy.mockResolvedValue(memory);
  onCreateMemoryReject = (error: ErrorResponse) =>
    this.createMemorySpy.mockRejectedValue(error);

  onGetMemoryResolve = (memory: Memory) =>
    this.getMemorySpy.mockResolvedValue(memory);

  onGetMemoryReject = (error: ErrorResponse) =>
    this.getMemorySpy.mockRejectedValue(error);

  build = (): NewMemoryScreenTestBed => {
    Platform.OS = 'ios';
    resetMockNavigation();
    store.dispatch(clearState());

    this.render = render(
      <Provider store={store}>
        <NewMemoryScreen />
      </Provider>,
    );
    return this;
  };
}

const testMemory: Memory = {
  mid: uuid(),
  createdAt: new Date(),
  occurredAt: new Date(),
  title: 'Some Title',
  location: 'Some Location',
  imageCount: 0,
  videoCount: 0,
  displayContent: undefined,
  tag: undefined,
};
