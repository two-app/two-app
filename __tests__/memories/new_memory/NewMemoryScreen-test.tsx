import {fireEvent, render, RenderAPI} from '@testing-library/react-native';
import {Platform, Text} from 'react-native';
import {Provider} from 'react-redux';
import {ReactTestInstance} from 'react-test-renderer';
import {NewMemoryScreen} from '../../../src/memories/new_memory/NewMemoryScreen';
import {store} from '../../../src/state/reducers';
import {Tag} from '../../../src/tags/Tag';
import * as TagService from '../../../src/tags/TagService';
import {resetMockNavigation} from '../../utils/NavigationMocking';

describe('NewMemoryScreen', () => {
  let tb: NewMemoryScreenTestBed;

  beforeEach(() => (tb = new NewMemoryScreenTestBed().build()));

  test('submit should be disabled on first load', () => {
    expect(tb.isSubmitEnabled()).toEqual(false);
  });

  // TODO find a way for the a11y labels to work for date time pickers
  // describe('valid form', () => {
  //   const formData = {
  //     title: 'New Memory',
  //     location: 'Some Location',
  //     occurredAt: new Date(),
  //   };

  //   beforeEach(() => {
  //     tb.setTitle(formData.title);
  //     tb.setLocation(formData.location);
  //     tb.setOccuredAt(formData.occurredAt);
  //   });

  //   test('submit should be enabled', () => {
  //     expect(tb.isSubmitEnabled()).toEqual(true);
  //   });
  // });
});

class NewMemoryScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  constructor() {
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

  // events
  private setInput = (input: ReactTestInstance, text: string) => {
    fireEvent.changeText(input, text);
    fireEvent(input, 'blur');
  };

  setTitle = (title: string) => this.setInput(this.titleInput(), title);
  setLocation = (loc: string) => this.setInput(this.locationInput(), loc);
  setOccuredAt = (date: Date) => {
    fireEvent.press(this.dateTimeInput());
    console.log(this.render.getByA11yHint('FIND ME').children[1]);
    fireEvent(this.datePicker(), 'onConfirm', date);
    fireEvent(this.timePicker(), 'onConfirm', date);
  };

  pressSubmit = () => fireEvent.press(this.submitButton());

  // request/response mocks
  getTagsSpy = jest.spyOn(TagService, 'getTags');

  onGetTagsResolve = (tags: Tag[]) => this.getTagsSpy.mockResolvedValue(tags);

  build = (): NewMemoryScreenTestBed => {
    Platform.OS = 'ios';
    resetMockNavigation();
    this.render = render(
      <Provider store={store}>
        <NewMemoryScreen />
      </Provider>,
    );
    return this;
  };
}
