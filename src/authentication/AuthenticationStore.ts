import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import create from 'zustand';
import {persist} from 'zustand/middleware';
import {Tokens} from './AuthenticationModel';
import {MixedUser} from './UserModel';

export type AuthState = {
  tokens?: Tokens;
  user?: MixedUser & {connected: boolean};
  set: (tokens: Tokens) => MixedUser;
};

export const useAuthStore = create<AuthState>(
  persist(
    (set, _) => ({
      tokens: undefined,
      // Extract the user from the tokens and store it in the state too
      set: (tokens: Tokens) => {
        const user: MixedUser = jwtDecode(tokens.accessToken);
        set({tokens, user: {...user, connected: 'cid' in user}});
        return user;
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
