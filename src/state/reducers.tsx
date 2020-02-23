import authenticationReducer from '../authentication/AuthenticationReducer';
import userReducer from '../authentication/UserReducer';
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import {Action, combineReducers, createStore} from 'redux';
import {createAction} from '@reduxjs/toolkit';
import {Persistor} from 'redux-persist/es/types';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const reducer = combineReducers({
    user: userReducer,
    authentication: authenticationReducer
});

const clearState: Action = createAction('CLEAR_STATE');
const rootReducer = (state: any, action: Action) => {
    if (action.type === clearState.type) {
        state = undefined;
    }
    return reducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor: Persistor = persistStore(store);
export {store, persistor, clearState};