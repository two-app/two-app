/* eslint-disable react/jsx-filename-extension */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {AppStack} from './Router';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://0bd8bfe500ec4218921e9d8e09611511@o1368063.ingest.sentry.io/6670442',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

export default Sentry.wrap(() => (
  <NavigationContainer>
    <AppStack />
  </NavigationContainer>
));
