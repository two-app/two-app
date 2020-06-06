import 'react-native';
import 'jest-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

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
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

// https://github.com/facebook/react-native/issues/27721
jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => 'TouchableOpacity');
jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => 'TextInput');

jest.mock('./src/navigation/RootNavigation', () => jest.requireActual('./src/navigation/__mocks__/RootNavigation'));

jest.useFakeTimers();