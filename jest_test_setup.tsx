/* eslint-disable no-undef */
/* eslint-disable import/order */
import 'react-native';
import 'jest-enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';

Enzyme.configure({adapter: new Adapter()});

// Ignore React Web errors when using React Native
// https://github.com/enzymejs/enzyme/issues/831
const originalConsoleError = console.error;
console.error = (message: string) => {
  if (message.startsWith('Warning:')) {
    return;
  }

  originalConsoleError(message);
};

// @ts-ignore
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import {setupMockNavigation} from './__tests__/utils/NavigationMocking';
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

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

jest.mock('./src/navigation/RootNavigation', () =>
  jest.requireActual('./src/navigation/__mocks__/RootNavigation'),
);

// https://github.com/software-mansion/react-native-reanimated/issues/205#issuecomment-596119975
jest.mock('react-native-reanimated', () =>
  jest.requireActual('./node_modules/react-native-reanimated/mock'),
);

jest.mock('react-native-keyboard-aware-scroll-view', () => {
    const KeyboardAwareScrollView = ({ children }) => children;
    return { KeyboardAwareScrollView };
});

setupMockNavigation();

jest.useFakeTimers();
