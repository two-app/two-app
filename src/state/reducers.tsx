import {userReducer, UserState} from '../user';
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {combineReducers, createStore} from 'redux';
import {DeepReadonly} from 'utility-types';
import {createAction, getType} from 'typesafe-actions';
import {Persistor} from 'redux-persist/es/types';
import {authReducer, AuthState} from '../authentication/store';

export type TwoState = DeepReadonly<{
    user?: UserState
    auth?: AuthState
}>;

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const reducer = combineReducers({
    user: userReducer,
    auth: authReducer
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