import {userReducer, UserState} from '../user';
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {combineReducers, createStore} from 'redux';
import {createAction, getType} from 'typesafe-actions';
import {Persistor} from 'redux-persist/es/types';
import {authReducer, AuthState} from '../authentication/store';
import { MemoryState, memoryReducer } from '../memories/store/reducers';

export type TwoState = {
    user?: UserState
    auth?: AuthState
    memories: MemoryState
};

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const reducer = combineReducers({
    user: userReducer,
    auth: authReducer,
    memories: memoryReducer
});

const clearState = createAction('CLEAR_STATE')();

const rootReducer = (state: any, action: any) => {
    if (action.type === getType(clearState)) {
        state = undefined;
    }
    return reducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor: Persistor = persistStore(store);
export {store, persistor, clearState};