/* eslint-disable no-undef */
/* eslint-disable import/order */
// @ts-nocheck

import 'react-native';

// Ignore React Web errors when using React Native
const originalConsoleError = console.error;
console.error = (message: string) => {
  if (message.startsWith('Warning:')) {
    return;
  }

  originalConsoleError(message);
};

import {NativeModules} from 'react-native';
NativeModules.ImageCropPicker = {
  openPicker: jest.fn(),
  openCamera: jest.fn(),
  openCropper: jest.fn(),
  clean: jest.fn(),
  cleanSingle: jest.fn(),
};

import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import {setupMockNavigation} from './__tests__/utils/NavigationMocking';
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((_, reducers) => reducers),
  };
});

// https://github.com/facebook/react-native/issues/27721
jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableOpacity',
  () => 'TouchableOpacity',
);
jest.mock(
  'react-native/Libraries/Components/TextInput/TextInput',
  () => 'TextInput',
);

// https://github.com/software-mansion/react-native-reanimated/issues/205#issuecomment-596119975
jest.mock('react-native-reanimated', () =>
  jest.requireActual('./node_modules/react-native-reanimated/mock'),
);

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-fs', () => {
  return {
    stat: jest.fn(),
    readFile: jest.fn(),
    read: jest.fn(),
    TemporaryDirectoryPath: jest.fn(),
  };
});

global.__reanimatedWorkletInit = jest.fn();

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({children}) => children;
  return {KeyboardAwareScrollView};
});

setupMockNavigation();
