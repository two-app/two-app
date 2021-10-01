import {Text} from 'react-native';
import type {RenderAPI, QueryReturn} from '@testing-library/react-native';
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import moment from 'moment';
import type {ReactTestInstance} from 'react-test-renderer';

import {ContentUploadScreen} from '../../src/content/ContentUploadScreen';
import type {PickedContent} from '../../src/content/ContentPicker';
import type {Memory} from '../../src/memories/MemoryModels';
import * as MemoryService from '../../src/memories/MemoryService';
import type {ErrorResponse} from '../../src/http/Response';
import {updateMemory, storeContent} from '../../src/memories/store';
import type {Content} from '../../src/content/ContentModels';

describe('ContentUploadScreen', () => {
  let tb: ContentUploadScreenTestBed;

  beforeEach(() => (tb = new ContentUploadScreenTestBed().build()));

  test('it should display content previews', () => {
    expect(
      tb.render.getAllByA11yLabel('A preview of selected content.').length,
    ).toEqual(testContentData.length);
  });

  test('it should display a loading screen on submit', () => {
    tb.pressSubmit();

    expect(tb.getLoadingScreen()).toBeTruthy();
  });

  test('it should navigate back on success', async () => {
    tb.onUploadToMemoryResolve(tb.memory, []);
    tb.pressSubmit();

    await waitForElementToBeRemoved(tb.queryLoadingScreen);

    expect(tb.goBackFn).toHaveBeenCalledTimes(1);
  });

  test('it should update the state in redux on success', async () => {
    const updatedMemory: Memory = {...tb.memory, imageCount: 99};
    const updatedContent: Content[] = [{test: 'test'} as any];

    tb.onUploadToMemoryResolve(updatedMemory, updatedContent);
    tb.pressSubmit();

    await waitForElementToBeRemoved(tb.queryLoadingScreen);

    expect(tb.dispatchFn).toHaveBeenCalledTimes(2);
    expect(tb.dispatchFn).toHaveBeenNthCalledWith(
      1,
      updateMemory({mid: updatedMemory.id, memory: updatedMemory}),
    );
    expect(tb.dispatchFn).toHaveBeenNthCalledWith(
      2,
      storeContent({mid: updatedMemory.id, content: updatedContent}),
    );
  });

  test('it should display an error on failure', async () => {
    const error: ErrorResponse = {
      code: 400,
      status: 'Bad Request',
      reason: 'Test Reason',
    };

    tb.onUploadToMemoryReject(error);
    tb.pressSubmit();

    await waitForElementToBeRemoved(tb.queryLoadingScreen);
    await waitFor(() => tb.render.getByText(error.reason));

    expect(
      tb.render.getByA11yHint('The error encountered with the upload.'),
    ).toBeTruthy();
    expect(tb.render.getByText(error.reason)).toBeTruthy();
  });
});

class ContentUploadScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);
  memory: Memory = testMemoryData;
  uploadContent: PickedContent[] = testContentData;
  goBackFn: jest.Mock;
  dispatchFn: jest.Mock;

  constructor() {
    this.onUploadToMemoryResolve(this.memory, []);
    this.goBackFn = jest.fn();
    this.dispatchFn = jest.fn();
  }

  onUploadToMemoryResolve = (
    updatedMemory: Memory,
    updatedContent: Content[],
  ) => {
    jest
      .spyOn(MemoryService, 'uploadToMemory')
      .mockResolvedValue([updatedMemory, updatedContent]);
  };

  onUploadToMemoryReject = (e: ErrorResponse) => {
    jest.spyOn(MemoryService, 'uploadToMemory').mockRejectedValue(e);
  };

  queryLoadingScreen = (): QueryReturn => {
    return this.render.queryByA11yHint('Waiting for an action to finish...');
  };

  getLoadingScreen = (): ReactTestInstance => {
    return this.render.getByA11yHint('Waiting for an action to finish...');
  };

  pressSubmit = () => {
    const button = this.render.getByA11yLabel('Upload Content');
    fireEvent.press(button);
  };

  build = (): ContentUploadScreenTestBed => {
    this.render = render(
      <ContentUploadScreen
        navigation={{goBack: this.goBackFn} as any}
        route={{
          params: {content: this.uploadContent, mid: this.memory.id},
          name: 'ContentUploadScreen',
          key: 'test-key',
        }}
        dispatch={this.dispatchFn}
        memory={this.memory}
      />,
    );
    return this;
  };
}

const testMemoryData: Memory = {
  id: 10,
  date: moment().valueOf(),
  imageCount: 0,
  videoCount: 0,
  location: 'Test Location',
  title: 'Test Title',
  displayContent: undefined,
  tag: undefined,
};

const testContentData: PickedContent[] = [
  {
    creationDate: '1299975445',
    cropRect: null,
    data: null,
    exif: null,
    filename: 'IMG_0001.JPG',
    height: 1800,
    mime: 'image/jpeg',
    modificationDate: '1441224147',
    // eslint-disable-next-line max-len
    path: '/Users/testuser/Library/Developer/CoreSimulator/Devices/AFAAA949-5F37-4592-A018-0E519EB95721/data/Containers/Data/Application/A43C1CCC-2B3D-4524-A375-9ACA08C1B4D7/tmp/react-native-image-crop-picker/8810EF27-83E3-43C1-AE04-F4CA5791EB59.jpg', // prettier-ignore
    size: 719863,
    width: 2710,
  },
  {
    creationDate: '1255122560',
    cropRect: null,
    data: null,
    exif: null,
    filename: 'IMG_0002.JPG',
    height: 1800,
    mime: 'image/jpeg',
    modificationDate: '1441224147',
    // eslint-disable-next-line max-len
    path: '/Users/testuser/Library/Developer/CoreSimulator/Devices/AFAAA949-5F37-4592-A018-0E519EB95721/data/Containers/Data/Application/A43C1CCC-2B3D-4524-A375-9ACA08C1B4D7/tmp/react-native-image-crop-picker/2822F237-D39D-49EA-A951-84D0D1E0E5C7.jpg', // prettier-ignore
    size: 896588,
    width: 2710,
  },
];
