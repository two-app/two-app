import {useEffect} from 'react';
import {useAuthStore} from './authentication/AuthenticationStore';
import {useContentStore} from './content/ContentStore';
import {useMemoryStore} from './memories/MemoryStore';

import {resetNavigate, Screen} from './navigation/NavigationUtilities';
import {useTagStore} from './tags/TagStore';
import {useProfileStore} from './user/ProfileStore';

export const LogoutScreen = ({navigation}: Screen<'LogoutScreen'>) => {
  useEffect(() => {
    useMemoryStore.setState({all: []});
    useContentStore.setState({memoryContent: {}});
    useProfileStore.setState({couple: undefined});
    useTagStore.setState({all: []});
    useAuthStore.setState({tokens: undefined, user: undefined});
    resetNavigate('LoginScreen', navigation);
  }, []);

  return <></>;
};
