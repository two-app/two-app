import 'react-native';
import 'jest-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

// Ignore React Web errors when using React Native
console.error = message => {
    return message;
};

// React Navigation has a couple of exports which can't be read by Jest. We mock the entire module for all tests.
// This may need expanding in future versions.
jest.mock('react-navigation', () => {
    return {
        createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {return null;}),
        createDrawerNavigator: jest.fn(),
        createMaterialTopTabNavigator: jest.fn(),
        createStackNavigator: jest.fn(),
        StackActions: {
            push: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/PUSH"})),
            replace: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/REPLACE"})),
            reset: jest.fn().mockImplementation(x => ({...x, "type": "Navigation/RESET"}))
        },
        NavigationActions: {
            navigate: jest.fn().mockImplementation(x => x),
        }
    }
});