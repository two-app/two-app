import AsyncStorage from '@react-native-community/async-storage';
import create from 'zustand';
import {persist} from 'zustand/middleware';
import {Couple} from '../couple/CoupleService';

export type ProfileState = {
  couple?: Couple;
};

export const useProfileStore = create<ProfileState>(
  persist(_ => ({}), {
    name: 'profile-storage',
    getStorage: () => AsyncStorage,
  }),
);
